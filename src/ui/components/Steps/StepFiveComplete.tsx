// src/ui/components/Steps/Step5_Complete.tsx

import React from 'react';
import { Button } from '../Button/Button';

interface StepFiveCompleteProps {
  referralCoupon: string | null;
}

const StepFiveComplete: React.FC<StepFiveCompleteProps> = ({ referralCoupon }) => {

  const handleShare = () => {
    const text = `Sabia que você pode economizar até 15% no consumo da sua conta de luz? ⚡ A Bulbe é a solução perfeita para quem busca economia, sem obras ou burocracia. Acesse o link e garanta essa oferta: https://assine.bulbeenergia.com.br/?cupom=${referralCoupon}`;
    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="step-container">
      <div className="step-header">
        <h2 className="step-title">Economia contratada com sucesso!</h2>
        <p className="step-description">
          Vamos mantê-lo informado pelo nosso aplicativo, e-mail e WhatsApp.
        </p>
      </div>
      {referralCoupon && (
        <div className="step-referral-box">
          <h3>Indique e Ganhe!</h3>
          <p>Compartilhe seu cupom exclusivo e ganhe R$50 no PIX a cada adesão válida.</p>
          <div className="step-coupon-code">{referralCoupon}</div>
          <Button onClick={handleShare} fullWidth>
            Compartilhar no WhatsApp
          </Button>
        </div>
      )}
    </div>
  );
};

export default StepFiveComplete;