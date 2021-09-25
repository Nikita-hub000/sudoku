<template>
<div class="box">
<div id="nav">
    <router-link class="link" to="/">Home</router-link> |
    <router-link class="link"  :class="{disabled: $store.state.isEnter}"   to="/about" >Sudoku</router-link>
</div>
  <router-view />
</div>
</template>

<script>

</script>

<style>
.link{
  text-decoration: none;
  color: teal;
}
.box{
  display: flex;
  flex-direction: column;
  align-items: center;
}
.disabled {
    opacity: 0.5;
    pointer-events: none;
}
</style>
