import React from 'react';

const ShippingPolicy = () => {
  return (
    <div className="bg-white p-6 md:p-12 lg:p-16 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Shipping Policy</h1>
      <p className="mb-4">
        Given below are the details for shipping/delivery of the products sold by
        reldaindia.com, a unit of LaMart Group.
      </p>

      <h2 className="text-xl font-semibold mb-2">Shipping/Delivery Area</h2>
      <p className="mb-4">
        Currently, delivery of products purchased on reldaindia.com, a unit of LaMart Group, is
        available across India. The Company shall exercise all possible measures to ensure that
        any product ordered on the Website is delivered as follows:
      </p>
      <ul className="list-disc list-inside mb-4">
        <li>
          Product will be delivered within 2 - 4 working days to the respective location.
        </li>
        <li>
          From the date of booking of order on the Website, subject to successful realization of
          payment made against the said Order and availability of the Product(s).
        </li>
      </ul>
      <p className="mb-4">
        However, the User understands and confirms that the Company shall not be held responsible for any delay in
        delivery of Product due to circumstances beyond the control of the Company, provided the
        Company takes all required and necessary steps to ensure delivery of the Product within
        the above-mentioned timelines.
      </p>

      <h2 className="text-xl font-semibold mb-2">Shipping Charges</h2>
      <p className="mb-4">
        All Products sold by reldaindia.com are delivered free across Tamilnadu.
      </p>
      <p className="mb-4">
        Your shipping address pin code will be verified with our database before you proceed to pay
        for your purchase. In case it is not serviceable by us, we would request you to provide us
        with an alternate shipping address that is on our partner delivery list.
      </p>

      <h2 className="text-xl font-semibold mb-2">How Does the Delivery Process Work?</h2>
      <p className="mb-4">
        The User agrees that the delivery can be made to the person who is present at the shipping
        address provided by the User. Once our system processes your order, your products are
        inspected thoroughly to ensure they are in perfect condition. After they pass through the
        final round of quality check, they are packed and handed over to our trusted delivery
        partner. Our delivery partner will deliver your package at the earliest possible.
      </p>
      <p className="mb-4">
        The delivery partner will make a maximum of three attempts to deliver your order. In case
        the User is not reachable or does not accept delivery of products in these attempts,
        reldaindia.com reserves the right to cancel the order at its discretion.
      </p>

      <h2 className="text-xl font-semibold mb-2">Order Tracking</h2>
      <p className="mb-4">
        Once your order has been dispatched, you will receive an email and/or SMS with the details
        of the tracking number along with our customer care contact information. You can track the status
        of your package 24 hours after your order is dispatched from our warehouse.
      </p>
    </div>
  );
};

export default ShippingPolicy;

