<template>
  <form @submit.prevent class="password">
    <h1 class="password__header">Введите новые данные</h1>
    <input
      class="password__input"
      v-model="pochta"
      placeholder="Введите вашу почту"
      @input="validateSign(pochta)"
    />
    <input
      class="password__input"
      v-model="old"
      @input="validateSign(old)"
      placeholder="Старый пароль"
    />
    <input
      class="password__input"
      v-model="newPas"
      @input="validateSign(newPas)"
      placeholder="Новый пароль"
    />
    <button
      :class="{ disabled: regBtn }"
      type="button"
      @click="sending()"
      class="password__button"
    >
      Отправить
    </button>
    <p class="error" v-show="regName">В имени и пароле минимум 6 символов</p>
    <p class="error" v-show="regEmail">Неправильный формат Email</p>
    <p class="ok" v-show="success">Пароль успешно сменен!</p>
    <p class="neok" v-show="err">Ошибка! Проверьте введенные данные</p>
  </form>
</template>

<script>
export default {
  data() {
    return {
      old: "",
      newPas: "",
      pochta: "",
      success: false,
      err: false,
      regName: false,
      regEmail: false,
      regBtn: false,
    };
  },
  methods: {
    async sending() {
      let result = await fetch("http://localhost:8080/api/auth/newPas", {
        method: "POST",
        body: JSON.stringify({
          email: this.pochta,
          old: this.old,
          newPas: this.newPas,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      }).then((res) => {
        console.log(res);
        if (res.status === 200) {
          this.err = false;
          this.success = true;
        } else {
          this.success = false;
          this.err = true;
        }
      });
      await result;
    },
    validateSign(block) {
      if (block === this.old || this.newPas) {
        if (
          /[a-z0-9]{6,}/gi.test(this.old) &&
          /[a-z0-9]{6,}/gi.test(this.newPas)
        ) {
          this.regName = false;
          this.regBtn = false;
        } else {
          this.regName = true;
          this.regBtn = true;
        }
      } else if (block === this.pochta) {
        if (
          /^([a-z0-9_-]+\.)*[a-z0-9_-]+@[a-z0-9_-]+(\.[a-z0-9_-]+)*\.[a-z]{2,6}$/.test(
            this.pochta
          )
        ) {
          this.regEmail = false;
          this.regBtn = false;
        } else {
          this.regEmail = true;
          this.regBtn = true;
        }
      }
    },
  },
};
</script>

<style scoped>
.password {
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-top: 50px;
}
.error {
  color: red;
  margin: 10px auto;
}
.regBtn {
  pointer-events: none;
  opacity: 0.5;
}
.ok {
  color: green;
  margin: 10px auto;
}
.neok {
  color: red;
  margin: 10px auto;
}
.password__header {
  color: teal;
  font-size: 20px;
  margin: 10px auto;
}
.password__input {
  width: 100px;
  height: 25px;
  border: 1px solid teal;
  padding: 10px;
  color: teal;
  margin: 20px auto;
}
.password__input:focus {
  outline: none;
}
.password__button {
  border: 1px solid teal;
  padding: 5px;
  width: 100px;
  height: 50px;
  margin: 10px auto;
  background: white;
}
.password__button:hover {
  transform: scale(0.8);
}
</style>
