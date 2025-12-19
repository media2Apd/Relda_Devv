import React from 'react'

const RefundPolicy = () => {
  return (
    <div className="bg-white p-6 md:p-12 lg:p-16 max-w-7xl mx-auto text-gray-800">
      <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">Refund Policy</h1>
      
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Cancellation and Return</h2>
        <p className="mb-4">
          <strong>reldaindia.com</strong>, a unit of LaMart Group, is committed to making your shopping experience with us as seamless and delightful as possible. We assure you that all products we sell are brand new and 100% genuine.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Cancellation</h2>
        <p className="mb-4">
          You can cancel orders for products partially or fully prior to the shipment being "Out for Delivery". Orders cannot be canceled once the package is "Out for Delivery".
        </p>
        <p className="mb-4">
          Track your order under the 'My Orders' section of your account.
        </p>
        <p className="mb-4">
          If you change your mind about a particular order, you may cancel the purchase order in the "My Orders" section of your account.
        </p>
        <p className="mb-4">
          Upon receipt of the cancellation request, we will attempt to cancel the order/shipments as long as it is not "Out for Delivery". You will receive an email once the cancellation is accepted, and the amount paid towards the partial/full order will be refunded to you within 3-7 business days from the date of acceptance of the cancellation request.
        </p>
        <p className="mb-4">
          The amount will be refunded through the same mode of payment used for the purchase or via credit to your store credit account, which can be used for subsequent purchases. All refunds, except for refunds to the store credit account, shall be subject to our discretion, applicable policies, and charges of the User's bank/financial institution.
        </p>
        <p className="mb-4">
          We reserve the right to cancel your bulk orders placed on the website. To avoid such cancellations and/or for bulk orders, please contact us at <a href="mailto:support@reldaindia.com" className="text-blue-600 hover:underline">support@reldaindia.com</a> or call us at +91 9884890934.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Replacement</h2>
        <p className="mb-4">
          In case your product is damaged, you can request a replacement, which must be reported to us(<a href="mailto:support@reldaindia.com" className="text-blue-600 hover:underline">support@reldaindia.com</a>) within 7 days of delivery. If the product you received is damaged, defective, or not as described, you must mail us with the reason, and once the mail is received, the return process will be initiated.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Return</h2>
        <p className="mb-4">
          Return is applicable only if there are any manufacturing defects, based on company approvals, and must be reported to us(<a href="mailto:support@reldaindia.com" className="text-blue-600 hover:underline">support@reldaindia.com</a>) within 7 days of delivery. Once approved, the return process will take 2 working days, and the payment will be refunded within 7 working days. If no manufacturing defect is confirmed or the issue is not diagnosed within 7 days of delivery, the return or refund request will be considered invalid.
        </p>
        <p className="mb-4">
          Users can send a Return request to our customer support team at <a href="mailto:support@reldaindia.com" className="text-blue-600 hover:underline">support@reldaindia.com</a> from your registered email ID with the reason for Product Return.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Refund</h2>
        <p className="mb-4">
          Refunds shall be considered for those purchases that are not replaceable and are logged in for damage, defect, or a different product only, as per the above-mentioned policy.
        </p>
        <p className="mb-4">
          For payments done through credit/debit cards, net banking, or cash cards, the refund will be initiated to the same account from which the payment was made within 24-48 business hours of us receiving the products back. It may take 5-7 additional business days for the amount to reflect in your account.
        </p>
        <p className="mb-4">
          For cash on delivery transactions, we will initiate a bank transfer against the refund amount, based on the billing details shared by you. This process will be completed within 24-48 business hours of us receiving the products back and your bank details on My Account and/or email from the registered email ID. It will take an additional 5-7 business days for the amount to reflect in your account. The bank details required are as follows:
        </p>
        <ul className="list-disc list-inside mb-4">
          <li>Name as on Bank Account :</li>
          <li>Name of the Bank :</li>
          <li>Account Number :</li>
          <li>IFSC Code :</li>
          <li>Order Number :</li>
        </ul>
      </section>
    </div>
  )
}

export default RefundPolicy
