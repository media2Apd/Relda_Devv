import React from 'react';

const PricingPolicy = () => {
  return (
    <div className="bg-white p-6 md:p-12 lg:p-16 max-w-7xl mx-auto text-gray-800">
      <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">RELDA Pricing Policy</h1>
      
      <section className='mb-8'>
        <p className="mb-4">
          At RELDA, we are committed to offering high-quality home appliances at fair and transparent prices. Our pricing policy is designed to ensure affordability, compliance with legal standards, and clarity for our customers.
        </p>
      </section>

      <section className='mb-8'>
        <h2 className="text-xl font-semibold mb-2">1. Price Composition</h2>
        <p className='mb-4'>
        All prices displayed for our products include the following components:
        <li>Applicable Taxes: Prices include GST and any other applicable taxes as per government regulations.</li>
        <li>Logistics Costs: If applicable, delivery charges are calculated separately and displayed clearly during checkout.</li>
        </p>

        <h2 className="text-xl font-semibold mb-2">2. Pricing Strategies</h2>
        <p className='mb-4'>
        <li>Transparent Pricing: The Maximum Retail Price (MRP) of each product is clearly displayed on the product label and our website.</li>
        <li>Discounts and Offers: Any promotional discounts, seasonal offers, or special prices will be clearly indicated alongside the original price.</li>
        <li>Value for Money: We aim to balance affordability and the premium quality of our products.</li>
        </p>

        <h2 className="text-xl font-semibold mb-2">3. Compliance with Government Policies</h2>
        <p className='mb-4'>
        <li>MRP Regulations: All RELDA products comply with the legal requirements for displaying the MRP, inclusive of all taxes.</li>
        <li>Barcodes: Every product is labeled with a barcode sticker for easy scanning and verification of price and details.</li>
        <li>Tax Invoices: All purchases are accompanied by a tax invoice as mandated by the GST Act.</li>
        </p>

        <h2 className="text-xl font-semibold mb-2">4. Payment Terms</h2>
        <p className='mb-4'>
        <li>Accepted Modes: We accept payments through credit/debit cards, UPI, net banking.</li>
        <li>EMI Options: Flexible EMI options are available on select products, subject to terms and conditions.</li>
        {/* <li>Refund Policy: Prices paid are refundable only as per the terms outlined in our Return & Refund Policy.</li> */}
        </p>

        <h2 className="text-xl font-semibold mb-2">5. Price Revisions</h2>
        <p className='mb-4'>
        <li>Prices are subject to periodic reviews and may be updated based on raw material costs, market conditions, or changes in tax rates.</li>
        <li>Any price changes will be updated on our website and communicated transparently to our customers.</li>
        </p>

        <h2 className="text-xl font-semibold mb-2">6. Shipping and Delivery Charges</h2>
        <p className='mb-4'>
        <li>Standard delivery charges will be added to the final price during checkout if applicable.</li>
        <li>For orders above a certain value, free shipping may be offered as per our promotional policies.</li>
        </p>

        <h2 className="text-xl font-semibold mb-2">7. Feedback and Discrepancies</h2>
        <p className='mb-4'>
        <li>If you notice any discrepancies or have questions regarding product pricing, please contact us at support@reldaindia.com.</li>
        This policy ensures that customers can make informed purchasing decisions while aligning with RELDA commitment to quality and compliance.
        </p>
       
      </section>

      <section className='mb-8'>
      <p className="mb-4">
      <strong className='text-xl font-semibold mb-2'>General Pricing :</strong> Our prices change continually. "List Price" means the suggested retail price of a product as provided by a manufacturer, supplier, or seller. We regularly check List Prices against prices recently found on RELDA. Certain products may have a "Was Price" displayed, which is determined using recent price history of the product on Relda.
      </p>
      <p className="mb-4">
      <strong className='text-xl font-semibold mb-2'>Quantity Discounts :</strong> Relda Business customers may have access to quantity discounts on certain larger quantity purchases. These quantity discounts are available on only certain items and on certain quantities of those items, and those items and quantities may change from time to time.
      </p>
      {/* <p className="mb-4">
      <strong className='text-xl font-semibold mb-2'>Save Discounts:</strong> Subscribers who purchase for the second time will receive a 5% discount on eligible products when they receive Save and an additional reorder discount when the same address remains unchanged. Subscribe and Save discounts apply to Subscribe and Save orders only.
      </p> */}
      <p className="mb-4">
      <strong className='text-xl font-semibold mb-2'>Pricing Confirmations -ERRORS- :</strong> With respect to items sold by Relda, we cannot confirm the price of an item until you place your order. Despite our best efforts, a small number of the items in our catalog may be mispriced. If the correct price of an item sold by Relda is higher than our stated price, we will, at our discretion, either contact you for instructions before shipping or cancel your order and notify you of such cancellation.
      </p>
      </section>
      
    </div>
  );
};

export default PricingPolicy;
