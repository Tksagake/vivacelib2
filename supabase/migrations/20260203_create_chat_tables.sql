-- Create chat_threads table
create table public.chat_threads (
  id uuid not null default extensions.uuid_generate_v4(),
  user_id uuid not null,

  title text null,
  model text not null default 'deepseek-chat',
  status text not null default 'active'
    check (status in ('active', 'archived')),

  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),

  constraint chat_threads_pkey primary key (id)
);

create index idx_chat_threads_user
  on public.chat_threads (user_id);

-- Create chat_messages table
create table public.chat_messages (
  id uuid not null default extensions.uuid_generate_v4(),
  thread_id uuid not null
    references public.chat_threads(id) on delete cascade,

  role text not null
    check (role in ('system', 'user', 'assistant')),

  content text not null,
  sequence int not null,

  created_at timestamptz not null default timezone('utc', now()),

  constraint chat_messages_pkey primary key (id),
  constraint chat_messages_thread_sequence unique (thread_id, sequence)
);

create index idx_chat_messages_thread
  on public.chat_messages (thread_id, sequence);

-- Create chat_uploads table
create table public.chat_uploads (
  id uuid not null default extensions.uuid_generate_v4(),
  thread_id uuid not null
    references public.chat_threads(id) on delete cascade,
  user_id uuid not null,

  storage_path text not null,
  file_name text not null,
  mime_type text not null,

  extracted_text text null,
  extraction_status text not null default 'pending'
    check (extraction_status in ('pending', 'processed', 'failed')),

  created_at timestamptz not null default timezone('utc', now()),

  constraint chat_uploads_pkey primary key (id)
);

create index idx_chat_uploads_thread
  on public.chat_uploads (thread_id);

-- Create storage bucket for chat uploads (if not exists)
insert into storage.buckets (id, name, public)
values ('chat-uploads', 'chat-uploads', false)
on conflict (id) do nothing;

-- Set up Row Level Security (RLS) policies
alter table public.chat_threads enable row level security;
alter table public.chat_messages enable row level security;
alter table public.chat_uploads enable row level security;

-- Policies for chat_threads
create policy "Users can view their own threads"
  on public.chat_threads for select
  using (auth.uid() = user_id);

create policy "Users can create their own threads"
  on public.chat_threads for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own threads"
  on public.chat_threads for update
  using (auth.uid() = user_id);

-- Policies for chat_messages
create policy "Users can view messages in their threads"
  on public.chat_messages for select
  using (
    exists (
      select 1 from public.chat_threads
      where chat_threads.id = chat_messages.thread_id
      and chat_threads.user_id = auth.uid()
    )
  );

create policy "Users can create messages in their threads"
  on public.chat_messages for insert
  with check (
    exists (
      select 1 from public.chat_threads
      where chat_threads.id = chat_messages.thread_id
      and chat_threads.user_id = auth.uid()
    )
  );

-- Policies for chat_uploads
create policy "Users can view their own uploads"
  on public.chat_uploads for select
  using (auth.uid() = user_id);

create policy "Users can create their own uploads"
  on public.chat_uploads for insert
  with check (auth.uid() = user_id);

-- Storage policies for chat-uploads bucket
create policy "Users can upload their own files"
  on storage.objects for insert
  with check (
    bucket_id = 'chat-uploads' and
    auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "Users can view their own files"
  on storage.objects for select
  using (
    bucket_id = 'chat-uploads' and
    auth.uid()::text = (storage.foldername(name))[1]
  );
