// sideTransition.ts
import { Animation, createAnimation } from '@ionic/core';

// ENTER-Animation: Modal fährt von rechts nach links ins Bild
export const sideEnterAnimation = (baseEl: HTMLElement): Animation => {
    const root = baseEl.shadowRoot ||  baseEl;

    // Anim für den Hintergrund (Backdropping)
    const backdropAnimation = createAnimation()
        .addElement(root.querySelector('ion-backdrop')!)
        .fromTo('opacity', '0.01', 'var(--backdrop-opacity, 0.4)');

    // Anim für das Modal-Wrapper-Element
    const wrapperAnimation = createAnimation()
        .addElement(root.querySelector('.modal-wrapper')!)
        .beforeStyles({ 'opacity': 1 })
        .fromTo('transform', 'translateX(100%)', 'translateX(0)');

    return createAnimation()
        .addElement(baseEl)
        .easing('ease-out')
        .duration(250) // Dauer der Animation
        .addAnimation([backdropAnimation, wrapperAnimation]);
};

// LEAVE-Animation: Modal verschwindet wieder nach rechts
export const sideLeaveAnimation = (baseEl: HTMLElement): Animation => {
    const root = baseEl.shadowRoot  || baseEl;

    const backdropAnimation = createAnimation()
        .addElement(root.querySelector('ion-backdrop')!)
        .fromTo('opacity', 'var(--backdrop-opacity, 0.4)', '0.0');

    const wrapperAnimation = createAnimation()
        .addElement(root.querySelector('.modal-wrapper')!)
        .fromTo('transform', 'translateX(0)', 'translateX(100%)');

    return createAnimation()
        .addElement(baseEl)
        .easing('ease-in')
        .duration(200)
        .addAnimation([backdropAnimation, wrapperAnimation]);
};