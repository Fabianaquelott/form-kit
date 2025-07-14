// src/ui/components/Steps/Step5_Complete.tsx

import React from 'react';
import styles from './Steps.module.css';
import { Button } from '../Button/Button';

interface Step5CompleteProps {
  referralCoupon: string | null;
}

const Step5_Complete: React.FC<Step5CompleteProps> = ({ referralCoupon }) => {

  const handleShare = () => {
    const text = `Sabia que você pode economizar até 15% no consumo da sua conta de luz? ⚡ A Bulbe é a solução perfeita para quem busca economia, sem obras ou burocracia. Acesse o link e garanta essa oferta: https://assine.bulbeenergia.com.br/?cupom=${referralCoupon}`;
    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className={styles.stepContainer}>
      <div className={styles.stepHeader}>
        <h2 className={styles.stepTitle}>Economia contratada com sucesso!</h2>
        <p className={styles.stepDescription}>
          Vamos mantê-lo informado pelo nosso aplicativo, e-mail e WhatsApp.
        </p>
      </div>
      {referralCoupon && (
        <div className={styles.referralBox}>
          <h3>Indique e Ganhe!</h3>
          <p>Compartilhe seu cupom exclusivo e ganhe R$50 no PIX a cada adesão válida.</p>
          <div className={styles.couponCode}>{referralCoupon}</div>
          <Button onClick={handleShare} fullWidth>
            Compartilhar no WhatsApp
          </Button>
        </div>
      )}
    </div>
  );
};

export default Step5_Complete;