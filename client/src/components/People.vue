<template>
  <section class="people">
    <input
      v-model="inputText"
      class="finder"
      placeholder="Найти игрока (введите ID игрока или его имя)"
      @input="find(inputText)"
    />
    <div class="people__container">
      <div class="card" v-for="(card, i) in cards" :key="i">
        <p class="card__text">Имя: {{ card.name }}</p>
        <p class="card__text">
          Количество решенных судоку: {{ card.sudokuCount }}
        </p>
        <div
          v-if="friend.some((x) => (x.requestUser === card.id || x.responseUser === card.id) && x.isFriend === true)"
        >
          <p class="friend__okay">Круто! Вы друзья!</p>
          <button class="friend__delete" @click="deleteFriend(card.id)">Удалить из друзей</button>
        </div>
        <div
          v-else-if="
            friend.some((x) => (x.responseUser === card.id) && !x.isFriend)
          "
        >
          <p class="friend__approve">Вы отправили запрос на дружбу</p>
          <button class="friend__delete" @click="deleteFriend(card.id)">Отменить</button>
        </div>
        <div v-else>
          <button class="friend__add" @click="addFriend(card.id)">Добавить в друзья</button>
        </div>

        <p class="card__link" @click="profile(card.id)">Перейти к профилю</p>
        <p class="exp bounce">{{ card.experience }} exp</p>
      </div>
    </div>
  </section>
</template>

<script>
import store from "@/store/index.js";
export default {
  data() {
    return {
      myStyle: {
        backgroundColor: `rgb(${Math.floor(Math.random() * 256)},${Math.floor(
          Math.random() * 256
        )},${Math.floor(Math.random() * 256)}`,
      },

      inputText: "",
      cards: [],
      cardsCopy: [],
      sudoku: [],
      friend: [],
    };
  },
  methods: {
    find(val) {
      console.log(val);
      console.log(this.cards[0].name)
      if(val.length > 0){
      this.cards = this.cards.filter((x) => x.name.toLowerCase().includes(val.toLowerCase()));
      }
      else{
        this.cards = this.cardsCopy
      }
    },
    profile(id) {
      this.$router.push(`/player/${id}`);
    },

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
    async getCards() {
      let result = await fetch("http://localhost:8080/players/render", {
        method: "POST",
        body: JSON.stringify({
          id: store.state.id.id,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((res) => res.json())
        .then((res) => (this.cards = res))
        .then((res) => (this.cardsCopy = res));
      console.log(result);
      await result;
    },
    async getFriends() {
      let result = await fetch("http://localhost:8080/friend/renderAll", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((res) => res.json())
        .then((res) => (this.friend = res));
      console.log(this.friend);
      await result;
    },
    async addFriend(val) {
      let newDate = new Date(Date.now())
      let result = await fetch("http://localhost:8080/friend/add", {
        method: "POST",
        body: JSON.stringify({
          requestUser: store.state.id.id,
          responseUser: val,
          date: `${newDate.getDate()}.${newDate.getMonth()+1}.${newDate.getFullYear()}`
        }),
        headers: {
          "Content-Type": "application/json",
        },
      })
      console.log(result);
      await result;
      this.getFriends()
    },
    async deleteFriend(val) {
      let result = await fetch("http://localhost:8080/friend/delete", {
        method: "PUT",
        body: JSON.stringify({
          requestUser: store.state.id.id,
          responseUser: val,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      })
      let result2 = await fetch("http://localhost:8080/friend/delete", {
        method: "PUT",
        body: JSON.stringify({
          requestUser: val,
          responseUser: store.state.id.id,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      })
      console.log(result);
      await result;
      await result2
      this.getFriends()
    },
  },
  mounted() {
    this.getCards();
    // this.getBestUser();
    this.getFriends();
  },
};
</script>

<style scoped>
.friend__okay {
  color: green;
}
.friend__approve {
  color: rgb(146, 187, 0);
}
.friend__delete {
  color: red;
  border: 1px solid red;
  background-color: white;
  cursor: pointer;
}
.friend__delete:hover {
  opacity: 0.8;
}

.friend__add {
  color: green;
  border: 1px solid green;
  background-color: white;
  cursor: pointer;
}
.friend__add:hover {
  opacity: 0.8;
}

.finder {
  width: 300px;
  height: 40px;
  outline: none;
  border: 1px solid teal;
}
.people {
  display: flex;
  flex-direction: column;
  margin-top: 30px;
  align-items: center;
}
.people__container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 20px;
  margin-top: 30px;
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
.card {
  display: flex;
  flex-direction: column;
  text-align: center;
  border: 1px solid teal;
  padding: 10px;
}
.exp {
  border: 1px solid teal;
  padding: 5px;
  background-color: teal;
  color: white;
  text-align: center;
}
.card__id {
  margin-top: 0;
  font-size: 12px;
  font-weight: 300;
}
.card__link {
  color: teal;
  text-decoration: underline;
  cursor: pointer;
}
.card__link:hover {
  opacity: 0.8;
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
