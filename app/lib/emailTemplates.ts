export const emailTemplates = {
    loanApplication: (loanId: string) => `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #E5E7EB; border-radius: 12px; overflow: hidden;">
        <header style="background: #14213D; padding: 24px; text-align: center; color: #fff;">
          <h1 style="margin: 0; font-size: 28px;">Farova Welfare</h1>
          <p style="margin: 8px 0; font-size: 16px;">Empowering Communities</p>
        </header>
        <main style="padding: 32px; color: #333;">
          <h2 style="color: #14213D; font-size: 24px;">🎉 Application Received!</h2>
          <p>Hi there,</p>
          <p>We’ve received your loan application <strong>(ID: ${loanId})</strong>. Our team is currently reviewing your request and will contact you soon with the next steps.</p>
          <p style="margin-top: 24px;">Thank you for trusting <strong>Farova Welfare</strong>.</p>
          <a href="#" style="display: inline-block; margin-top: 32px; padding: 12px 24px; background: #FCA311; color: #fff; text-decoration: none; border-radius: 8px; font-weight: bold;">View Application</a>
        </main>
        <footer style="background: #FCA311; padding: 16px; text-align: center; color: #fff; font-size: 14px;">
          &copy; ${new Date().getFullYear()} Farova Welfare. All rights reserved.
        </footer>
      </div>
    `,
  
    loanApproval: (loanId: string) => `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #E5E7EB; border-radius: 12px; overflow: hidden;">
      <header style="background: #14213D; padding: 24px; text-align: center; color: #fff;">
        <h1 style="margin: 0; font-size: 28px;">Farova Welfare</h1>
        <p style="margin: 8px 0; font-size: 16px;">Empowering Communities</p>
      </header>
      <main style="padding: 32px; color: #333;">
        <h2 style="color: #14213D; font-size: 24px;">✅ Loan Approved!</h2>
        <p>Hello,</p>
        <p>Your loan application  has been approved.</p>
        <p>The funds will be disbursed shortly to your registered account.</p>
        <p> If you have any questions, feel free to reach out to our support team.</p>
        <p style="margin-top: 24px;">Thank you for trusting <strong>Farova Welfare</strong>.</p>
        <p style="margin-top: 24px;">You can track your disbursement status by clicking the button below:</p>

        <a href="#" style="display: inline-block; margin-top: 32px; padding: 12px 24px; background: #FCA311; color: #fff; text-decoration: none; border-radius: 8px; font-weight: bold;">
          Track Disbursement
        </a>
      </main>
      <footer style="background: #FCA311; padding: 16px; text-align: center; color: #fff; font-size: 14px;">
        &copy; ${new Date().getFullYear()} Farova Welfare. All rights reserved.
      </footer>
    </div>
  `,

  loanRejection: (loanId: string) => `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #E5E7EB; border-radius: 12px; overflow: hidden;">
      <header style="background: #14213D; padding: 24px; text-align: center; color: #fff;">
        <h1 style="margin: 0; font-size: 28px;">Farova Welfare</h1>
        <p style="margin: 8px 0; font-size: 16px;">Empowering Communities</p>
      </header>
      <main style="padding: 32px; color: #333;">
        <h2 style="color: #14213D; font-size: 24px;">❌ Loan Declined</h2>
        <p>Hello,</p>
        <p>Your loan application  has been declined.</p>
        <p>We understand this may be disappointing, but we encourage you to apply again in the future.</p>
        <p>Please note that the decision was made based on our internal criteria and policies.</p>
        <p>If you have any questions or need further clarification, please do not hesitate to reach out.</p>
        <p style="margin-top: 24px;">Thank you for considering <strong>Farova Welfare</strong>.</p>
        <p style="margin-top: 24px;">You can track your application status by clicking the button below:</p>
        <a href="#" style="display: inline-block; margin-top: 32px; padding: 12px 24px; background: #FCA311; color: #fff; text-decoration: none; border-radius: 8px; font-weight: bold;">
      <footer style="background: #FCA311; padding: 16px; text-align: center; color: #fff; font-size: 14px;">
        &copy; ${new Date().getFullYear()} Farova Welfare. All rights reserved.
      </footer>
    </div>
  `,
  
    disbursement: () => `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #E5E7EB; border-radius: 12px; overflow: hidden;">
        <header style="background: #14213D; padding: 24px; text-align: center; color: #fff;">
          <h1 style="margin: 0; font-size: 28px;">Farova Welfare</h1>
          <p style="margin: 8px 0; font-size: 16px;">Empowering Communities</p>
        </header>
        <main style="padding: 32px; color: #333;">
          <h2 style="color: #14213D; font-size: 24px;">💸 Loan Disbursed!</h2>
          <p>Hello,</p>
            <p>We are pleased to inform you that your loan application has been approved.</p>
          <p>Your loan  has been successfully disbursed to your registered account.</p>
          <p>We appreciate your trust in us and are here to support you on your financial journey.</p>
          <p>Thank you for choosing Farova Welfare.</p>
        </main>
        <footer style="background: #FCA311; padding: 16px; text-align: center; color: #fff; font-size: 14px;">
          &copy; ${new Date().getFullYear()} Farova Welfare. All rights reserved.
        </footer>
      </div>
    `,
  
    paymentReceived: (amount: number) => `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #E5E7EB; border-radius: 12px; overflow: hidden;">
        <header style="background: #14213D; padding: 24px; text-align: center; color: #fff;">
          <h1 style="margin: 0; font-size: 28px;">Farova Welfare</h1>
          <p style="margin: 8px 0; font-size: 16px;">Empowering Communities</p>
        </header>
        <main style="padding: 32px; color: #333;">
          <h2 style="color: #14213D; font-size: 24px;">✅ Payment Received!</h2>
          <p>Hello,</p>
          <p>We’ve successfully received your payment of <strong>KES ${amount.toLocaleString()}</strong>.</p>
          <p>Your financial journey is on the right track!</p>
        </main>
        <footer style="background: #FCA311; padding: 16px; text-align: center; color: #fff; font-size: 14px;">
          &copy; ${new Date().getFullYear()} Farova Welfare. All rights reserved.
        </footer>
      </div>
    `,
  };
  