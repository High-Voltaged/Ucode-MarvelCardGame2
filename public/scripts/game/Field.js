import Card from "./Card.js";

class Field {

    constructor(player) {

        this.player = player;
        this.selectedAttacker = null;
        this.selectedTarget = null;
        this.cards = [];
        this.updateManaBy(this.player.mana);
    
    }

    attackInProgress() {
        
        return this.selectedAttacker && this.selectedTarget;

    }

    clearAttacker() {
        
        if (!this.selectedAttacker) return;
        this.selectedAttacker.cardHTML.classList.remove("attacker-card");
        this.selectedAttacker = null;
        
    }
    
    clearTarget() {
        
        if (!this.selectedTarget) return;
        this.selectedTarget.cardHTML.classList.remove("target-card");
        this.selectedTarget = null;
    
    }

    clearAttack() {

        setTimeout(() => {
            this.clearAttacker();
            this.clearTarget();
        }, 3000);

    }

    addOpponentCard(cardData) {

        let card = new Card(cardData, this);
        card.render(`.game-field .opponent-field`, true);
        card.fillCardData();
        card.cardHTML.classList.add("enemy-card", "played");

        card.cardHTML.addEventListener("click", () => {

            if (this.attackInProgress())
                return;

            if (this.selectedAttacker) {

                // this.clearTarget();
                this.selectedTarget = card;
                card.cardHTML.classList.add("target-card");
                console.log(`${this.selectedAttacker.cardData.alias}'s attacking
                            ${this.selectedTarget.cardData.alias}`);

                // submit the attack

                this.clearAttack();

            }

        });

        const oppCards = document.querySelector(`.opponent-container .card-container`);
        oppCards.removeChild(oppCards.lastChild);

    }

    addPlayerCard(card) {

        if (this.player.mana - card.cardData.cost < 0)
            return;

        const cardContainer = document.querySelector(`.game-field .player-field`);
        card.cardHTML.classList.add("played");
        card.cardHTML.addEventListener("click", () => {

            if (this.attackInProgress())
                return;

            this.clearAttacker();
            this.selectedAttacker = card;
            card.cardHTML.classList.add("attacker-card");

        });
        cardContainer.appendChild(card.cardHTML);
        card.clearCardEvents();
        this.cards.push(card.cardData);
        // socket event here
        this.player.mana -= card.cardData.cost;
        this.updateManaBy();

    }

    updateManaBy() {

        const manaCount = document.querySelector(".mana-count");
        let currentMana = this.player.mana;
        manaCount.textContent = `${currentMana}/10`;
        const manaBar = document.querySelector(".mana-progress-bar");
        manaBar.style.width = `${currentMana * 10}%`;

    }

}

export default Field;
