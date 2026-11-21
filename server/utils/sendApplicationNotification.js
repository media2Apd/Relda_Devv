
const transporter = require("../config/nodemailerConfig");

const NOTIFICATION_CONFIG = {
  SUBMITTED: {
    status: "Submitted",
    customerTitle: "Application Submitted Successfully!",
    customerSubtitle: "Thank you for choosing RELDA India Pvt Ltd",
    customerMessage:
      "Thank you for submitting your application. We have received your application successfully. Our team will review your details and contact you soon.",
    adminTitle: "New Application Received",
    adminSubtitle: "A new customer application has been submitted",
    adminMessage:
      "A new application has been received. Please review the application details below.",
    subject: "Application Submitted",
  },

  UPDATED: {
    status: "Updated",
    customerTitle: "Application Details Updated",
    customerSubtitle: "Your RELDA application has been updated",
    customerMessage:
      "Your application details have been updated successfully. Our team will review the latest information.",
    adminTitle: "Application Details Updated",
    adminSubtitle: "An application has been updated",
    adminMessage:
      "The customer application details have been updated. Please review the latest application details.",
    subject: "Application Updated",
  },

  APPROVED: {
    status: "Approved",
    customerTitle: "Application Approved!",
    customerSubtitle: "Welcome to RELDA India Pvt Ltd",
    customerMessage:
      "Congratulations! Your application has been approved successfully. Welcome to the RELDA Authorized Network.",
    adminTitle: "Application Approved",
    adminSubtitle: "A customer application has been approved",
    adminMessage:
      "The application has been approved successfully. Please find the application details below.",
    subject: "Application Approved",
  },
REJECTED: {
  status: "Rejected",
  customerTitle: "Application Status Update",
  customerSubtitle: "Your RELDA application has been rejected",
  customerMessage:
    "We regret to inform you that your application has been rejected. Please review the reason below.",
  adminTitle: "Application Rejected",
  adminSubtitle: "A customer application has been rejected",
  adminMessage:
    "The application has been rejected. The rejection reason is provided below.",
  subject: "Application Rejected",
},
};

const escapeHtml = (value = "") => {
  return String(value).replace(/[&<>"']/g, (character) => {
    const entities = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };

    return entities[character];
  });
};

const generateApplicationEmailHtml = ({
  title,
  subtitle,
  message,
  customerName,
  applicationType,
  applicationId,
  customerEmail,
  status,
    rejectionReason,
  isAdmin = false,
}) => {
  const statusColors = {
    Submitted: { background: "#e3f2fd", color: "#1565c0" },
    Updated: { background: "#fff3e0", color: "#e65100" },
    Approved: { background: "#e8f5e9", color: "#2e7d32" },
    Rejected: { background: "#ffebee", color: "#c62828" },
  };

  const statusStyle = statusColors[status] || statusColors.Submitted;

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>

    <body style="margin:0; padding:0; background-color:#f4f5f7; font-family:Arial, Helvetica, sans-serif;">

      <table width="100%" cellspacing="0" cellpadding="0"
        style="background-color:#f4f5f7; padding:30px 10px;">
        <tr>
          <td align="center">

            <table width="600" cellspacing="0" cellpadding="0"
              style="max-width:600px; width:100%; background:#ffffff; border-radius:16px; overflow:hidden;">

              <tr>
                <td align="center"
                  style="background:#ffffff; padding:25px 20px; border-bottom:2px solid #f2f2f2;">
                  <img
                    src="https://res.cloudinary.com/dbbebewu2/image/upload/v1790846726/Logo_sjwqqe.png"
                    alt="RELDA India Pvt Ltd"
                    style="max-width:170px; height:auto; display:block;"
                  />
                </td>
              </tr>

              <tr>
                <td style="background:linear-gradient(135deg,#E60000 0%,#b80000 100%); padding:30px 20px; text-align:center;">
                  <h1 style="color:#ffffff; margin:0; font-size:24px; font-weight:800;">
                    ${escapeHtml(title)}
                  </h1>
                  <p style="color:#ffe6e6; margin:8px 0 0; font-size:14px;">
                    ${escapeHtml(subtitle)}
                  </p>
                </td>
              </tr>

              <tr>
                <td style="padding:30px 25px;">

                  <p style="margin:0 0 14px; font-size:16px; color:#111; font-weight:700;">
                    Dear ${escapeHtml(customerName || "Customer")},
                  </p>

                  <p style="margin:0 0 22px; font-size:14px; color:#555; line-height:1.7;">
                    ${escapeHtml(message)}
                  </p>

                  <table width="100%" cellspacing="0" cellpadding="0"
                    style="background:#fff5f5; border-left:4px solid #E60000; border-radius:6px; margin-bottom:24px;">
                    <tr>
                      <td style="padding:12px 16px;">
                        <span style="font-size:11px; color:#888; text-transform:uppercase; letter-spacing:1px; font-weight:bold;">
                          Application Reference ID
                        </span>
                        <div style="font-size:18px; font-weight:800; color:#E60000; margin-top:5px;">
                          #${escapeHtml(applicationId || "N/A")}
                        </div>
                      </td>
                    </tr>
                  </table>

                  <table width="100%" cellspacing="0" cellpadding="0"
                    style="border:1px solid #eef0f2; border-radius:12px; overflow:hidden; margin-bottom:24px;">

                    <tr style="background:#fafbfc;">
                      <td colspan="2"
                        style="padding:12px 16px; font-size:12px; font-weight:800; color:#444; text-transform:uppercase; border-bottom:1px solid #eef0f2;">
                        Application Details
                      </td>
                    </tr>

                    <tr>
                      <td style="padding:12px 16px; color:#666; font-size:14px; border-bottom:1px solid #f0f0f0;">
                        Application Type
                      </td>
                      <td style="padding:12px 16px; color:#111; font-weight:700; font-size:14px; text-align:right; border-bottom:1px solid #f0f0f0;">
                        ${escapeHtml(applicationType)}
                      </td>
                    </tr>

                    ${
                      isAdmin
                        ? `
                          <tr>
                            <td style="padding:12px 16px; color:#666; font-size:14px;">
                              Customer Email
                            </td>
                            <td style="padding:12px 16px; color:#111; font-weight:700; font-size:14px; text-align:right;">
                              ${escapeHtml(customerEmail || "N/A")}
                            </td>
                          </tr>
                        `
                        : ""
                    }

                    <tr>
                      <td style="padding:14px 16px; color:#111; font-size:15px; font-weight:700;">
                        Application Status
                      </td>
                      <td style="padding:14px 16px; text-align:right;">
                        <span style="background:${statusStyle.background}; color:${statusStyle.color}; padding:5px 13px; border-radius:20px; font-size:12px; font-weight:bold;">
                          ${escapeHtml(status)}
                        </span>
                      </td>
                    </tr>

                  </table>
                    <!-- REJECTION REASON -->
                 ${
  status === "Rejected"
    ? `
      <table width="100%" cellspacing="0" cellpadding="0"
        style="background:#fff5f5; border:1px solid #ffcdd2; border-radius:10px; margin-bottom:24px;">
        <tr>
          <td style="padding:16px;">
            <p style="margin:0 0 8px; color:#c62828; font-size:14px; font-weight:700;">
              Rejection Reason
            </p>
            <p style="margin:0; color:#555; font-size:14px; line-height:1.7;">
              ${escapeHtml(rejectionReason || "Not provided")}
            </p>
          </td>
        </tr>
      </table>
    `
    : ""
}

                  <table width="100%" cellspacing="0" cellpadding="0"
                    style="background:#ffffff; border:1.5px dashed #E60000; border-radius:12px; text-align:center; margin-bottom:24px;">
                    <tr>
                      <td style="padding:16px 18px;">
                        <p style="margin:0; font-size:13px; color:#222; font-weight:700;">
                          Need assistance?
                        </p>
                        <p style="margin:6px 0 0; font-size:13px; color:#666;">
                          Email us:
                          <a href="mailto:support@reldaindia.com"
                            style="color:#E60000; text-decoration:none; font-weight:bold;">
                            support@reldaindia.com
                          </a>
                          &nbsp;|&nbsp;
                          Call:
                          <a href="tel:9884890934"
                            style="color:#E60000; text-decoration:none; font-weight:bold;">
                            9884890934
                          </a>
                        </p>
                      </td>
                    </tr>
                  </table>

                  <p style="margin:20px 0 0; font-size:14px; color:#333; line-height:1.5;">
                    Warm Regards,<br>
                    <strong style="color:#E60000; font-size:15px;">
                      RELDA India Pvt Ltd
                    </strong>
                  </p>

                </td>
              </tr>

              <tr>
                <td style="background:#1a1a1a; padding:22px 20px; text-align:center;">
                  <p style="margin:0 0 6px; font-size:12px; color:#888;">
                    © ${new Date().getFullYear()} RELDA India Pvt Ltd. All rights reserved.
                  </p>
                  <p style="margin:0; font-size:12px;">
                    <a href="https://www.reldaindia.com"
                      style="color:#ffffff; text-decoration:none; font-weight:600;">
                      www.reldaindia.com
                    </a>
                  </p>
                </td>
              </tr>

            </table>

          </td>
        </tr>
      </table>

    </body>
    </html>
  `;
};

const sendApplicationNotification = async ({
  event,
  customerEmail,
  customerName,
  applicationType,
  applicationId,
    rejectionReason,
  adminEmails = [],
}) => {
  const config = NOTIFICATION_CONFIG[event];

  if (event === "REJECTED" && !rejectionReason?.trim()) {
  throw new Error("Rejection reason is required for rejection notification");
}

  if (!config) {
    throw new Error(`Invalid application notification event: ${event}`);
  }

  if (!applicationType || !applicationId) {
    throw new Error("Application type and application ID are required");
  }

  const emailTasks = [];

// Send customer email for all events except UPDATED
if (event !== "UPDATED" && customerEmail) {
  emailTasks.push({
    type: "CUSTOMER",
    email: customerEmail,
    send: () =>
      transporter.sendMail({
        from: '"RELDA India Pvt Ltd" <support@reldaindia.com>',
        to: customerEmail,
        subject: `${applicationType} ${config.subject} | RELDA India Pvt Ltd`,
        html: generateApplicationEmailHtml({
          title: config.customerTitle,
          subtitle: config.customerSubtitle,
          message: config.customerMessage,
          customerName,
          applicationType,
          applicationId,
          status: config.status,
            rejectionReason,
        }),
      }),
  });
} else if (event !== "UPDATED") {
  console.warn(`${event} customer notification skipped: email missing`);
}

  const uniqueAdminEmails = [
    ...new Set(
      adminEmails
        .filter(Boolean)
        .map((email) => String(email).trim().toLowerCase())
        .filter(Boolean)
    ),
  ];

  uniqueAdminEmails.forEach((email, index) => {
    emailTasks.push({
      type: `ADMIN_${index + 1}`,
      email,
      send: () =>
        transporter.sendMail({
          from: '"RELDA India Pvt Ltd" <support@reldaindia.com>',
          to: email,
          subject: `${applicationType} ${config.subject} | RELDA India Pvt Ltd`,
          html: generateApplicationEmailHtml({
            title: config.adminTitle,
            subtitle: config.adminSubtitle,
            message: config.adminMessage,
            customerName,
            applicationType,
            applicationId,
            customerEmail,
            status: config.status,
              rejectionReason,
            isAdmin: true,
          }),
        }),
    });
  });

  const settledResults = await Promise.allSettled(
    emailTasks.map((task) => task.send())
  );

  const results = {
    customer: null,
    admins: [],
  };

  settledResults.forEach((result, index) => {
    const task = emailTasks[index];

    let emailResult;

    if (result.status === "fulfilled") {
      const info = result.value;

      emailResult = {
        success: true,
        email: task.email,
        messageId: info.messageId,
        accepted: info.accepted,
        rejected: info.rejected,
        response: info.response,
      };

   
    } else {
      emailResult = {
        success: false,
        email: task.email,
        error: result.reason?.message || "Email sending failed",
      };

      console.error(`${task.type} ${event} EMAIL FAILED:`, {
        to: task.email,
        message: result.reason?.message,
        code: result.reason?.code,
        response: result.reason?.response,
      });
    }

    if (task.type === "CUSTOMER") {
      results.customer = emailResult;
    } else {
      results.admins.push(emailResult);
    }
  });

  const success =
    emailTasks.length > 0 &&
    settledResults.every((result) => result.status === "fulfilled");

  return {
    success,
    message: `${event} notification process completed`,
    results,
  };
};

module.exports = sendApplicationNotification;
