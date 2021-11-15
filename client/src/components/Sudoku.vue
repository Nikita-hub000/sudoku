<template>
  <section class="main">
    <div class="sudoku">
      <h1 class="accLink" @click="gotoacc()">Мой аккаунт</h1>
      <button
        class="main_btn"
        @click="
          generate();
          toDB();
          getId();
        "
      >
        Начать играть!
      </button>
      <div v-show="isGenerate" class="sudoku__table">
        <input
          :class="{ disabled: isFinish || counterError >= 3, noEvent: value === null }"
          class="sudoku__item"
          type="number"
          v-for="(s, index) in sudoku"
          :key="index"
          :value="s"
          :disabled="isFinish || counterError >= 3"
          @input="
            checkColor(index, $event);
            change(index) ? (isFinish = true) : (isFinish = false);
            isFinish ? postUser(): ''
          "
        />
      </div>
    </div>
    <p>Количество ошибок: {{ counterError }}/3</p>
    <p v-show="isFinish">Поздравляем! Вы победили!</p>
    <p v-show="counterError >= 3">Вы проиграли:(</p>
  </section>
</template>

<script>
import { uuid } from "uuidv4";
import { makepuzzle, solvepuzzle } from "sudoku";
import store from "@/store/index.js";
export default {
  data() {
    return {
      sudoku: [],
      isGenerate: false,
      trueVariant: [],
      isFinish: false,
      counterError: 0,
      id: "",
      info: {},
    };
  },
  methods: {
    generate() {
      this.isGenerate = false;
      let a = makepuzzle();
      this.sudoku = a;
      this.trueVariant = solvepuzzle(a);
      console.log(a)
      console.log(this.trueVariant)
      this.id = uuid();
      this.isGenerate = true;
      this.counterError = 0;
    },
    gotoacc() {
      this.$router.push("/acc");
    },
    checkColor(ind, e) {
      let el = document.querySelectorAll(".sudoku__item")[ind].value;
      if (this.trueVariant[ind] === parseInt(el)) {
        this.isError = false;
        document.querySelectorAll(".sudoku__item")[ind].classList.remove("red");
        document.querySelectorAll(".sudoku__item")[ind].classList.add("text");
        return null;
      } else {
        this.isError = true;
        document
          .querySelectorAll(".sudoku__item")[ind].classList.remove("text");
        document.querySelectorAll(".sudoku__item")[ind].classList.add("red");
        e.target.value === "" ? this.counterError : (this.counterError += 1);
        return el;
      }
    },

    change(ind) {
      let s = this.sudoku;
      let el = document.querySelectorAll(".sudoku__item")[ind].value;
      s[ind] = parseInt(el);
      for (let i = 0; i < this.sudoku.length; i++)
        if (this.sudoku[i] != this.trueVariant[i]) return false;

      return true;
    },
    async getId() {
      let result = await fetch("http://localhost:8080/sudoku/userId", {
        method: "POST",
        body: JSON.stringify({
          email: store.state.name.email,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((res) => {
          return res.ok ? res.json() : "error";
        })
        .then((res) => (this.info = res["1"][0]));

      await result;
    },
    async postUser() {
      let result = await fetch("http://localhost:8080/sudoku/solve", {
        method: "POST",
        body: JSON.stringify({
          id: this.id,
          userId: this.info.id,
          email: this.info.email,
          experience: this.info.experience + Math.random() * (100 - 1) + 1,
          sudokuCount: this.info.sudokuCount + 1
        }),
        headers: {
          "Content-Type": "application/json",
        },
      }).then((res) => {
        if (res.status === 200) {
          console.log("ok");
        } else {
          console.log("neok");
        }
      });
      await result;
    },
    async toDB() {
      let result = await fetch("http://localhost:8080/sudoku/bd", {
        method: "POST",
        body: JSON.stringify({
          id: this.id,
          numbers: this.trueVariant,
          trueVariant: this.sudoku,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      }).then((res) => {
        if (res.status === 200) {
          console.log("ok");
        } else {
          console.log("neok");
        }
      });
      await result;
    },
  },
};
</script>

<style scoped>
.disabled {
  opacity: 0.5;
}
.red {
  color: red;
}
.sudoku {
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.sudoku__item {
  max-width: 40px;
  height: 40px;
  border: 1px solid teal;
  border-collapse: collapse;
  text-align: center;
  padding: 3px 2px 3px;
  background-color: white;
}
.sudoku__item:nth-of-type(10 + 10) {
  border-bottom: 1px solid blue;
}
.accLink {
  color: teal;
  margin: 10px auto;
}
.accLink:hover {
  text-decoration: underline;
}
.noEvent{
  pointer-events: none;
}

.text {
  color: green;
}
.sudoku__item:focus {
  outline: none;
}
.sudoku__item:nth-child(3n){
  border-right: 1px solid rgb(255, 94, 0);
}
.sudoku__item:nth-child(9n+1){
  border-left: 1px solid rgb(255, 94, 0);
}
.sudoku__item:nth-child(n+19):nth-child(-n+27){
    border-bottom: 1px solid rgb(255, 94, 0);
}
.sudoku__item:nth-child(n+1):nth-child(-n+9){
    border-top: 1px solid rgb(255, 94, 0);
}
.sudoku__item:nth-child(n+73):nth-child(-n+81){
    border-bottom: 1px solid rgb(255, 94, 0);
}
.sudoku__item:nth-child(n+19):nth-child(-n+27){
    border-bottom: 1px solid rgb(255, 94, 0);
}
.sudoku__item:nth-child(n+46):nth-child(-n+54){
    border-bottom: 1px solid rgb(255, 94, 0);
}




/* .sudoku__item:nth-child(1n){
  border-left: 1px solid blue;
} */

.sudoku__table {
  border: 1px solid teal;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  max-width: 414px;
  border-collapse: collapse;
  max-height: 500px;
  margin-top: 50px;
  justify-self: center;
  text-align: center;
}
.main_btn {
  padding: 10px 15px;
  background: none;
  color: teal;
  width: 150px;
  height: 100px;
  border: 1px solid teal;
  margin: 100px auto 0;
}

input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  /* display: none; <- Crashes Chrome on hover */
  -webkit-appearance: none;
  margin: 0; /* <-- Apparently some margin are still there even though it's hidden */
}
</style>
