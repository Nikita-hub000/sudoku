<template>
  <form @submit.prevent class="register">
    <div class="box" v-if="isShowSign">
      <div class="ribbon"></div>
      <div class="login">
        <h1>Sign in</h1>
        <p>This will be an amazing experience</p>

        <div class="input">
          <div class="blockinput">
            <i class="icon-envelope-alt"></i>
            <input
              v-model="userLog.name"
              @input="validateSign(userLog.name)"
              placeholder="Name"
            />
          </div>
          <div class="blockinput">
            <i class="icon-envelope-alt"></i>
            <input
              v-model="userLog.email"
              @input="validateSign(userLog.email)"
              placeholder="Email"
            />
          </div>
          <div class="blockinput">
            <i class="icon-unlock"></i>
            <input
              v-model="userLog.password"
              @input="validateSign(userLog.password)"
              placeholder="Password"
            />
          </div>
        </div>
        <button
          :class="{ disabled: signBtn }"
          class="register__btn"
          @click="sign()"
        >
          Войти
        </button>
        <button class="register__btn" @click="showReg()">
          Еще нет аккаунта? Зарегистрироваться
        </button>
      </div>
      <p v-if="isSign" style="margin-top: 10px;">
        Вы ввели неверные данные
      </p>
      <p class="error" v-show="regSignName">
        В имени и пароле минимум 6 символов
      </p>
      <p class="error" v-show="regSignEmail">Неправильный формат Email</p>
    </div>
    <div class="box" v-else-if="!isShowSign">
      <div class="ribbon"></div>
      <div class="login">
        <h1>Sign up</h1>
        <p>This will be an amazing experience</p>

        <div class="input">
          <div class="blockinput">
            <i class="icon-envelope-alt"></i>
            <input
              v-model="user.name"
              @input="validate(user.name)"
              placeholder="Name"
            />
          </div>

          <div class="blockinput">
            <i class="icon-unlock"></i>
            <input
              v-model="user.email"
              @input="validate(user.email)"
              placeholder="Email"
            />
          </div>
          <div class="blockinput">
            <i class="icon-unlock"></i>
            <input
              @input="validate(user.password)"
              v-model="user.password"
              type="password"
              placeholder="Password"
            />
          </div>
        </div>
        <button
          :class="{ disabled: regBtn }"
          class="register__btn"
          @click="reg()"
        >
          Зарегистрироваться
        </button>
        <button class="register__btn" @click="showLogin()">
          Уже есть аккаунт? Войти
        </button>
      </div>
      <p v-if="isOk" style="margin-top: 10px;">
        Такой аккаунт уже существует. Попробуйте другое имя пользователя
      </p>
      <p class="error" v-show="regName">В имени и пароле минимум 6 символов</p>
      <p class="error" v-show="regEmail">Неправильный формат Email</p>
    </div>
  </form>
</template>

<script>
import store from "@/store/index.js";
export default {
  data() {
    return {
      isOk: false,
      isSign: false,
      isShowSign: true,
      regBtn: false,
      regName: false,
      regEmail: false,
      regSignName: false,
      regSignEmail: false,
      signBtn: false,
      userLog: {
        email: "",
        password: "",
        name: "",
      },
      user: {
        name: "",
        email: "",
        password: "",
      },
    };
  },
  methods: {
    async reg() {
      let result = await fetch("http://localhost:8080/api/auth/registration", {
        method: "POST",
        body: JSON.stringify(this.user),
        headers: {
          "Content-Type": "application/json",
        },
      }).then((res) => {
        console.log(res);
        if (res.status === 200) {
          this.isOk = false;
          this.isShowSign = true;
        } else {
          this.isShowSign = false;
          this.isOk = true;
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
        .then((res) => (
          store.commit("showId", {
            id: res["1"][0]['id']
          })))

      await result;
    },
    async sign() {
      let result = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        body: JSON.stringify({
          email: this.userLog.email,
          password: this.userLog.password,
          name: this.userLog.name,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      }).then((res) => {
        if (res.status === 200) {
          console.log("okay");
          store.commit("login");
          store.commit("showName", {
            login: this.userLog.name,
            password: this.userLog.password,
            email: this.userLog.email,
          });
          this.$router.push("/about");
          this.isSign = false;
        } else {
          console.log("no");
          this.isSign = true;
          store.commit("notlogin");
        }
      });
      this.getInfo()
      await result;
    },
    showLogin() {
      this.isShowSign = true;
      this.user.name = "";
      this.user.email = "";
      this.user.password = "";
      this.regName = false;
      this.regBtn = false;
      this.regEmail = false;
    },
    showReg() {
      this.isShowSign = false;
    },
    validateSign(block) {
      console.log("block");
      if (block === this.userLog.name || this.userLog.password) {
        if (
          /[a-z0-9]{6,}/gi.test(this.userLog.name) &&
          /[a-z0-9]{6,}/gi.test(this.userLog.password)
        ) {
          this.regSignName = false;
          this.signBtn = false;
        } else {
          this.regSignName = true;
          this.signBtn = true;
        }
      } else if (block === this.userLog.email) {
        if (
          /^([a-z0-9_-]+\.)*[a-z0-9_-]+@[a-z0-9_-]+(\.[a-z0-9_-]+)*\.[a-z]{2,6}$/.test(
            this.userLog.email
          )
        ) {
          this.regSignEmail = false;
          this.signBtn = false;
        } else {
          this.regSignEmail = true;
          this.signBtn = true;
        }
      }
    },
    validate(smth) {
      console.log("aaaa");
      if (smth === this.user.name || this.user.password) {
        if (
          /[a-z0-9]{6,}/gi.test(this.user.name) &&
          /[a-z0-9]{6,}/gi.test(this.user.password)
        ) {
          this.regName = false;
          this.regBtn = false;
        } else {
          this.regName = true;
          this.regBtn = true;
        }
      } else if (smth === this.user.email) {
        if (
          //todo
          /^([a-z0-9_-]+\.)*[a-z0-9_-]+@[a-z0-9_-]+(\.[a-z0-9_-]+)*\.[a-z]{2,6}$/.test(
            this.user.email
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
.error {
  color: red;
  margin: 10px auto;
}
.box {
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.regBtn {
  pointer-events: none;
  opacity: 0.5;
}
h2 {
  text-align: center;
  color: #f1f2f4;
  text-shadow: 0 1px 0 #000;
}
a {
  text-decoration: none;
  color: #ec5c93;
}
.ribbon {
  background: rgba(200, 200, 200, 0.5);
  width: 50px;
  height: 70px;
  margin: 0 auto;
  position: relative;
  top: 19px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-top: 2px solid rgba(255, 255, 255, 0.5);
  border-bottom: 0;
  border-radius: 5px 5px 0 0;
  box-shadow: 0 0 3px rgba(0, 0, 0, 0.7);
}
.ribbon:before {
  content: "";
  display: block;
  width: 15px;
  height: 15px;
  background: #4e535b;
  border: 4px solid #cfd0d1;
  margin: 18px auto;
  box-shadow: inset 0 0 5px #000, 0 0 2px #000, 0 1px 1px 1px #a7a8ab;
  border-radius: 100%;
}
.login {
  background: #f1f2f4;
  border-bottom: 2px solid #c5c5c8;
  border-radius: 5px;
  text-align: center;
  color: #36383c;
  text-shadow: 0 1px 0 #fff;
  max-width: 300px;
  margin: 0 auto;
  padding: 15px 40px 20px 40px;
  box-shadow: 0 0 3px #000;
}
.login:before {
  content: "";
  display: block;
  width: 70px;
  height: 4px;
  background: #4e535b;
  border-radius: 5px;
  border-bottom: 1px solid #ffffff;
  border-top: 2px solid #cbcbcd;
  margin: 0 auto;
}
h1 {
  font-size: 1.6em;
  margin-top: 30px;
  margin-bottom: 10px;
}
p {
  font-family: "Open Sans", Arial, sans-serif;
  font-weight: 300;
  color: #7b808a;
  margin-top: 0;
  margin-bottom: 30px;
}
.input {
  text-align: right;
  background: #e5e7e9;
  border-radius: 5px;
  overflow: hidden;
  box-shadow: inset 0 0 3px #65686e;
  border-bottom: 1px solid #fff;
}
input {
  width: 260px;
  background: transparent;
  border: 0;
  line-height: 3.6em;
  box-sizing: border-box;
  color: #71747a;
  font-family: "Open Sans", Arial, sans-serif;
  text-shadow: 0 1px 0 #fff;
}
input:focus {
  outline: none;
}
.blockinput {
  border-bottom: 1px solid #bdbfc2;
  border-top: 1px solid #ffffff;
}
.blockinput:first-child {
  border-top: 0;
}
.blockinput:last-child {
  border-bottom: 0;
}
.blockinput i {
  padding-right: 10px;
  color: #b1b3b7;
  text-shadow: 0 1px 0 #fff;
}
::-webkit-input-placeholder {
  color: #71747a;
  font-family: "Open Sans", Arial, sans-serif;
  text-shadow: 0 1px 0 #fff;
}
button {
  margin-top: 20px;
  display: block;
  width: 100%;
  line-height: 2em;
  background: rgba(114, 212, 202, 1);
  border-radius: 5px;
  border: 0;
  cursor: pointer;
  border-top: 1px solid #b2ece6;
  box-shadow: 0 0 0 1px #46a294, 0 2px 2px #808389;
  color: #ffffff;
  font-size: 1.5em;
  text-shadow: 0 1px 2px #21756a;
}
button:hover {
  background: linear-gradient(
    to bottom,
    rgba(107, 198, 186, 1) 0%,
    rgba(57, 175, 154, 1) 100%
  );
}
button:active {
  box-shadow: inset 0 0 5px #000;
  background: linear-gradient(
    to bottom,
    rgba(57, 175, 154, 1) 0%,
    rgba(107, 198, 186, 1) 100%
  );
}
</style>
