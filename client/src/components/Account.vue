<template>
  <div class="acc">
    <h1 class="myAcc">Мой аккаунт</h1>
    <p class="txt">
      Имя: <span>{{ $store.state.name.login }}</span>
    </p>
    <p class="txt">
      Пароль: <span>{{ isShow ? $store.state.name.password : "..." }}</span>
      <span @click="isShow = !isShow" class="btn">{{
        isShow ? "Скрыть" : "Показать"
      }}</span>
    </p>
    <p class="txt">
      Почта: <span>{{ $store.state.name.email }}</span>
    </p>
    <p class="txt">
      Количество решенных судоку: <span>{{ user.sudokuCount }}</span>
    </p>
    <p class="exp bounce">
      {{ user.experience }} exp
    </p>
    <p class="link" @click="back()">Вернуться на главный экран</p>
    <p class="link" @click="isClick = !isClick">Поменять пароль?</p>
    <form @submit.prevent v-if="isClick" class="forma">
      <input
        v-model="mail"
        class="email__input"
        placeholder="Введите свою почту"
      />
      <button type="button" class="email__button" @click="send()">
        Выслать email
      </button>
      <p class="success" v-show="success">Отлично! Письмо отправлено!</p>
      <p class="err" v-show="err">
        Ошибка! Проверьте правильность ввода почты!
      </p>
    </form>
  </div>
</template>

<script>
import store from "../store/index";
export default {
  data() {
    return {
      isClick: false,
      mail: "",
      success: false,
      err: false,
      user: {},
      isShow: false,
    };
  },
  methods: {
    back() {
      this.$router.push("/about");
    },
    async send() {
      let result = await fetch("http://localhost:8080/api/auth/restore", {
        method: "POST",
        body: JSON.stringify({ email: this.mail }),
        headers: {
          "Content-Type": "application/json",
        },
      }).then((res) => {
        if (res.status === 200) {
          console.log("okay");
          this.err = false;
          this.success = true;
        } else {
          console.log("no");
          this.success = false;
          this.err = true;
        }
      });
      await result;
    },
    async getInfo() {
      let result = await fetch("http://localhost:8080/sudoku/userId", {
        method: "POST",
        body: JSON.stringify({ email: store.state.name.email }),
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((res) => {
          return res.ok ? res.json() : "error";
        })
        .then((res) => (this.user = res["1"][0]));

      await result;
    },
  },
  beforeMount() {
    this.getInfo();
  },
};
</script>

<style scoped>
.btn {
  margin-left: 2px;
  color: teal;
  cursor: pointer;
}
.brn:hover {
  text-decoration: underline;
}
.success {
  color: green;
  margin: 10px auto;
}
.err {
  color: red;
  margin: 10px auto;
}
.email__input {
  width: 150px;
  height: 25px;
  border: 1px solid teal;
  padding: 10px;
  color: teal;
  margin: 20px auto;
}
.email__input:focus {
  outline: none;
}
.email__button {
  border: 1px solid teal;
  padding: 5px;
  width: 100px;
  height: 50px;
  margin: 10px auto;
  background: white;
}
.email__button:hover {
  transform: scale(0.8);
}
.txt {
  border: 1px solid teal;
  padding: 5px;
}
.exp{
  border: 1px solid teal;
  padding: 5px;
  background-color: teal;
  color: white;
  text-align: center;
}
.myAcc {
  font-size: 20px;
  margin: 20px auto;
}
.forma {
  display: flex;
  flex-direction: column;
}
.acc {
  display: flex;
  flex-direction: column;
}
.link {
  color: teal;
}
.link:hover {
  cursor: pointer;
  text-decoration: underline;
}
.bounce {
  animation-name: bounce;
  animation-timing-function: ease;
  animation-duration: 0.7s;
  animation-iteration-count: 1;
}
@keyframes bounce {
  0% {
    width: 20%;
  }
  50% {
    width: 75%;
  }
  100% {
    width: 100%;
  }
}
</style>
