import React, { useRef } from 'react';
import { useFormContext } from 'react-hook-form';
import CustomScrollbar from '../ScrollBar/CustomScrollbar';
import styles from './StepFour.module.css';

const StepFourContract: React.FC = () => {
  const { register, formState: { errors } } = useFormContext()

  const scrollRef = useRef<HTMLDivElement | null>(null);


  return (
    <div className={styles.stepContainer}>
      <div className={styles.stepHeader}>
        <h2 className={styles.stepTitle}>Leia o termo de adesão para contratar.</h2>
        <p className={styles.stepDescription}>
          Concorde com o Termo de Adesão para contratar e começar a economizar.
        </p>
      </div>

      <div style={{ borderTop: '1px solid #C2CCD6', marginTop: '40px' }}></div>

      <div>
        <h2 className={styles.adhesionTitle}>Termo de adesão</h2>
        <p className={styles.adhesionSubtitle}>Última atualização em 22/01/2025</p>
      </div>
      <div className={styles.container}>
        <CustomScrollbar height={220} thickness={8} thumbMinSize={120}>
          <div id="termsContract" ref={scrollRef}>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Gravia rutrum quisque non tellus orci ac auctor. Magna fermentum iaculis eu non. Non tellus orci ac auctor augue mauris augue. In arcu cursus euismod quis viverra nibh cras pulvinar mattis. Sit amet mauris commodo quis imperdiet massa tincidunt nunc. Sit amet mattis vulputate enim nulla aliquet porttitor lacus. Et odio pellentesque diam volutpat commodo. Sit amet mattis vulputate enim nulla aliquet porttitor lacus. Sit amet mattis
            </p>
            <p>
              In arcu cursus euismod quis viverra nibh cras pulvinar mattis. Sit amet mauris commodo quis imperdiet massa tincidunt nunc. Sit amet mattis vulputate enim nulla aliquet porttitor lacus. Et odio pellentesque diam volutpat commodo. Sit amet mattis vulputate enim nulla aliquet porttitor lacus.
            </p>
            <p>
              In arcu cursus euismod quis viverra nibh cras pulvinar mattis. Sit amet mauris commodo quis imperdiet massa tincidunt nunc. Sit amet mattis vulputate enim nulla aliquet porttitor lacus. Et odio pellentesque diam volutpat commodo.
            </p>
            <p>
              In arcu cursus euismod quis viverra nibh cras pulvinar mattis. Sit amet mauris commodo quis imperdiet massa tincidunt nunc. Sit amet mattis vulputate enim nulla aliquet porttitor lacus. Et odio pellentesque diam volutpat commodo.
            </p>

            <p>
              In arcu cursus euismod quis viverra nibh cras pulvinar mattis. Sit amet mauris commodo quis imperdiet massa tincidunt nunc. Sit amet mattis vulputate enim nulla aliquet porttitor lacus. Et odio pellentesque diam volutpat commodo.
            </p>


          </div>
        </CustomScrollbar>
      </div>
    </div>
  )
}

export default StepFourContract;