import { useSelector } from "react-redux";
import { getCartAmount } from "../redux/features/cartSlice";

const CartTotal = () => {
  const currency = useSelector((state) => state.config.currency);
  const delivery_fee = useSelector((state) => state.config.deliveryFee);
  const cartItems = useSelector((state) => state.cart.cartItems);
  const products = useSelector((state) => state.products.list);

  const cartTotal = useSelector((state) =>
    getCartAmount(state, state.products.list)
  );

  return (
    <div className="w-full">
      <div className="text-2xl">
        <div className="inline-flex gap-2 items-center mb-3">
          <p className="text-gray-500">
            CART <span className="text-gray-700 font-medium">TOTAL</span>
          </p>
          <p className="w-8 sm:w-12 h-[1.5px] sm:h-[2px] bg-gray-700"></p>
        </div>
      </div>

      <div className="flex flex-col gap-2 mt-2 text-sm">
        <div className="flex justify-between">
          <p>Subtotal</p>
          <p>
            {currency}

            {cartTotal ? cartTotal.toFixed(2) : "0.00"}
          </p>
        </div>
        <hr />
        <div className="flex justify-between">
          <p>Shipping Fee</p>
          <p>
            {currency} {delivery_fee}
          </p>
        </div>
        <hr />
        <div className="flex justify-between">
          <b>Total</b>
          <b>
            {currency}
            {(cartTotal || 0) + delivery_fee}.00
          </b>
        </div>
      </div>
    </div>
  );
};

export default CartTotal;
