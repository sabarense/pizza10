import React, { useState } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import axios from "axios";

const CheckoutForm: React.FC = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!stripe || !elements) {
      setError("Stripe não carregou corretamente.");
      setLoading(false);
      return;
    }

    // Chame seu backend para criar o PaymentIntent e obter o clientSecret
    try {
      const { data } = await axios.post("http://localhost:5000/api/payment-intent", {}, { withCredentials: true });
      const clientSecret = data.clientSecret;

      const cardElement = elements.getElement(CardElement);
      if (!cardElement) {
        setError("Erro ao carregar o campo do cartão.");
        setLoading(false);
        return;
      }

      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
        },
      });

      if (stripeError) {
        setError(stripeError.message || "Erro no pagamento.");
        setLoading(false);
        return;
      }

      setSuccess(true);
      setLoading(false);
    } catch (err: any) {
      setError("Erro ao processar pagamento.");
      setLoading(false);
    }
  };

  return (
    <form className="checkout-form" onSubmit={handleSubmit}>
      <CardElement options={{ hidePostalCode: true }} />
      <button className="checkout-btn" type="submit" disabled={loading || success}>
        {loading ? "Processando..." : "Pagar"}
      </button>
      {error && <div className="payment-error">{error}</div>}
      {success && <div className="payment-success">Pagamento realizado com sucesso!</div>}
    </form>
  );
};

export default CheckoutForm;
