<template>
  <div class="acc">
    <h1 class="myAcc">Аккаунт пользователя: {{ userInfo.id }}</h1>
    <p class="txt">
      Имя: <span>{{ userInfo.name }}</span>
    </p>
    <p class="txt">
      Количество решенных судоку: <span>{{ userInfo.sudokuCount }}</span>
    </p>
    <p class="exp bounce">{{ userInfo.experience }} exp</p>
    <p class="link" @click="back()">Вернуться на Find Players</p>
    <p class="link" @click="chatOpen = !chatOpen">
      {{ chatOpen ? "Прекратить чатиться:(" : "Початиться!" }}
    </p>

    <div class="messageInChat" v-if="chatOpen">
      <div
        :class="{
          messageClient: mes.fromId === userInfo.id,
          messageMy: mes.toId === userInfo.id,
        }"
        v-for="(mes, i) in myMessage"
        :key="i"
      >
        <div v-if="mes.toId === userInfo.id && messageId === mes.id" class="editedFalse" :class="{edited: edit}">
          <input v-model="editText" placeholder="Edit" />
          <button @click="editMessage(editText, mes.id)" class="chatButton">
            Редактировать
          </button>
        </div>
        <p class="msg__text">{{ mes.text }}</p>
        <div v-if="mes.toId === userInfo.id">
          <button class="chatButton" @click="deleteMessage(mes.id)">Удалить</button>
          <button class="chatButton" @click="edit = !edit; messageId = mes.id">
            {{ edit ? "Отменить" : "Редактировать" }}
          </button>
        </div>
        <p class="msg__date">
          {{
            new Date(mes.date).getHours().toString().length === 1
              ? "0" + new Date(mes.date).getHours().toString()
              : new Date(mes.date).getHours()
          }}:{{
            new Date(mes.date).getMinutes().toString().length === 1
              ? "0" + new Date(mes.date).getMinutes().toString()
              : new Date(mes.date).getMinutes()
          }}
          {{ new Date(mes.date).getDate() }}.{{
            new Date(mes.date).getMonth() + 1
          }}.{{ new Date(mes.date).getFullYear() }}
        </p>
      </div>
    </div>
    <form class="chatInput" action="POST" @submit.prevent="sendMessage(text)"  v-if="chatOpen">
      <input
        v-model="text"
        class="chatMessage"
        placeholder="Введите сообщение"
      />
      <button class="chatButton">Отправить</button>
    </form>
    <div v-for="(item, index) in sudoku" :key="index" class="sudoku__table">
      <input
        class="sudoku__item"
        type="number"
        v-for="(s, i) in item[0]['numbers']"
        :key="i"
        :value="s"
        :disabled="true"
      />
    </div>
  </div>
</template>

<script>
// `${date.getHours().toString().length === 1 ? '0'+`${date.getHours()}`: `${date.getHours()}`}:${date.getMinutes().toString().length === 1 ? `0${date.getMinutes()}`: `${date.getMinutes()}`} ${date.getDate()}.${date.getMonth()+1}.${date.getFullYear()}`
import store from "@/store/index.js";
export default {
  data() {
    return {
      userInfo: {},
      sudoku: [],
      isChat: false,
      text: "",
      myMessage: [],
      edit: false,
      editText: '',
      chatOpen: false,
      messageId: ''
    };
  },
  methods: {
    async getUserInfo() {
      let result = await fetch("http://localhost:8080/players/getUserInfo", {
        method: "POST",
        body: JSON.stringify({
          id: this.$route.params.id,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((res) => res.json())
        .then((res) => (this.userInfo = res[0]));
      await result;
      this.getSudoku(this.userInfo.id);
      this.renderMessage();
    },
    back() {
      this.$router.push("/people");
    },
    async getSudoku(id) {
      let result = await fetch("http://localhost:8080/sudoku/userSudoku", {
        method: "POST",
        body: JSON.stringify({
          userId: id,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((res) => res.json())
        .then((res) => (this.sudoku = res));
      console.log(result);
      await result;
    },
    async sendMessage(txt) {
      let date = Date.now();
      console.log(date);
      let result = await fetch("http://localhost:8080/chat/add", {
        method: "POST",
        body: JSON.stringify({
          fromId: store.state.id.id,
          toId: this.userInfo.id,
          date: date,
          text: txt,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log(result);
      await result;
      this.renderMessage();
      this.text = "";
    },
    async renderMessage() {
      let result = await fetch("http://localhost:8080/chat/render", {
        method: "POST",
        body: JSON.stringify({
          fromId: store.state.id.id,
          toId: this.userInfo.id,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((res) => (res = res.json()))
        .then((res) => res.sort((a, b) => a.date - b.date))
        .then((res) => (this.myMessage = res));
      console.log(result);
      console.log(1111)
      await result;
    },
     async deleteMessage(id) {
      let result = await fetch("http://localhost:8080/chat/delete", {
        method: "PUT",
        body: JSON.stringify({
          id
        }),
        headers: {
          "Content-Type": "application/json",
        },
      })
      await result;
      this.renderMessage();
    },
    async editMessage(text, id) {
      let result = await fetch("http://localhost:8080/chat/update", {
        method: "PUT",
        body: JSON.stringify({
          id, text
        }),
        headers: {
          "Content-Type": "application/json",
        },
      })
      await result;
      this.renderMessage();
      this.edit = false
    },
  },
  mounted() {
    this.getUserInfo();
  },
};
</script>

<style scoped>
.msg__text {
  margin-left: 2px;

}
.msg__date {
  margin-left: 2px;
  color: teal;
}
.chatInput {
  align-self: center;
  display: flex;
  flex-direction: row;
  margin-top: 40px;
}
.chatButton {
  border: teal;
  padding: 15px;
  margin-left: 5px;
  color: teal;
  cursor: pointer;
}
.chatMessage {
  height: 40px;
  width: 300px;
  border: 1px solid teal;
}
.chatMessage:focus {
  outline: none;
}
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
.noEvent {
  pointer-events: none;
}

.text {
  color: green;
}
.sudoku__item:focus {
  outline: none;
}
.sudoku__item:nth-child(3n) {
  border-right: 1px solid rgb(255, 94, 0);
}
.sudoku__item:nth-child(9n + 1) {
  border-left: 1px solid rgb(255, 94, 0);
}
.sudoku__item:nth-child(n + 19):nth-child(-n + 27) {
  border-bottom: 1px solid rgb(255, 94, 0);
}
.sudoku__item:nth-child(n + 1):nth-child(-n + 9) {
  border-top: 1px solid rgb(255, 94, 0);
}
.sudoku__item:nth-child(n + 73):nth-child(-n + 81) {
  border-bottom: 1px solid rgb(255, 94, 0);
}
.sudoku__item:nth-child(n + 19):nth-child(-n + 27) {
  border-bottom: 1px solid rgb(255, 94, 0);
}
.sudoku__item:nth-child(n + 46):nth-child(-n + 54) {
  border-bottom: 1px solid rgb(255, 94, 0);
}

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
.acc {
  display: flex;
  flex-direction: column;
}
.myAcc {
  font-size: 20px;
  margin: 20px auto;
}
.txt {
  border: 1px solid teal;
  padding: 5px;
}
.link {
  color: teal;
}
.link:hover {
  cursor: pointer;
  text-decoration: underline;
}
.exp {
  border: 1px solid teal;
  padding: 5px;
  background-color: teal;
  color: white;
  text-align: center;
}
.bounce {
  animation-name: bounce;
  animation-timing-function: ease;
  animation-duration: 0.7s;
  animation-iteration-count: 1;
}
.messageInChat {
  display: flex;
  flex-direction: column;
}
.messageClient {
  align-self: flex-start;
  border: 1px solid rgb(58, 55, 255);
  margin-top: 10px;
}
.messageMy {
  align-self: flex-end;
  border: 1px solid rgb(47, 255, 245);
  margin-top: 10px;
}
.editedFalse {
  display: none;
}
.edited {
  display: flex;
}
.msg__edit {
  display: none;
}
.list-item {
  display: inline-block;
  margin-right: 10px;
}
.list-enter-active,
.list-leave-active {
  transition: all 1s ease;
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateY(30px);
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
