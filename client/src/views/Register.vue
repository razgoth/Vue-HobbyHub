<template>
  <div class="background">
    <div class="col-md-12">
      <div class="globalMargin">
        <div class="card card-container">
          <img
            id="profile-img"
            src="//ssl.gstatic.com/accounts/ui/avatar_2x.png"
            class="profile-img-card"
          />
          <h3>Sign up</h3>
          <form name="form" @submit.prevent="handleRegister">
            <div v-if="!successful">
              <div class="form-group">
                <label>Username</label>
                <input
                  v-model="user.username"
                  v-validate="'required|min:3|max:20'"
                  type="text"
                  class="form-control"
                  name="username"
                  placeholder="Username"
                />
                <div
                  v-if="submitted && errors.has('username')"
                  class="alert-danger"
                >{{errors.first('username')}}</div>
              </div>

              <div class="form-group">
                <label>Password</label>
                <input
                  v-model="user.password"
                  v-validate="'required|min:6|max:40'"
                  name="password"
                  type="password"
                  class="form-control"
                  placeholder="Password"
                  ref="password">
                <div
                  v-if="submitted && errors.has('password')"
                  class="alert-danger"
                >{{errors.first('password')}}</div>
              </div>

              <div class="form-group">
                <label>Confirm password</label>
                <input
                  v-validate="'required|confirmed:password'"
                  name="password_confirmation"
                  type="password"
                  class="form-control"
                  placeholder="Type the password again"
                  data-vv-as="password">
              </div>

              <div class="alert alert-danger" v-show="errors.any()">
                <div v-if="errors.has('password')">
                  {{ errors.first('password') }}
                </div>
                <div v-if="errors.has('password_confirmation')">
                  {{ errors.first('password_confirmation') }}
                </div>
              </div>

              <div class="form-group">
                <button class="btn btn-primary btn-block">Sign Up</button>
              </div>
            </div>
          </form>

          <div
            v-if="message"
            class="alert"
            :class="successful ? 'alert-success' : 'alert-danger'"
          >{{message}}</div>
          <div class="text">
            Already a member? <a href="/login">Sign in!</a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import User from '../models/user'

export default {
  name: 'Register',
  data() {
    return {
      user: new User('', ''),
      submitted: false,
      successful: false,
      message: ''
    }
  },
  computed: {
    loggedIn() {
      return this.$store.state.auth.status.loggedIn
    }
  },
  mounted() {
    if (this.loggedIn) {
      this.$router.push('/account')
    }
  },
  methods: {
    handleRegister() {
      this.message = ''
      this.submitted = true
      this.$validator.validate().then(isValid => {
        if (isValid) {
          this.$store.dispatch('auth/register', this.user).then(
            data => {
              this.message = data.message
              this.successful = true
            },
            error => {
              this.message =
                (error.response && error.response.data && error.response.data.message) ||
                error.message ||
                error.toString()
              this.successful = false
            }
          )
        }
      })
    }
  }
}
</script>

<style scoped>
label {
  display: block;
  margin-top: 10px;
}

.card-container.card {
  max-width: 350px !important;
  padding: 40px 40px;
}

.card {
  background-color: #f7f7f7;
  padding: 20px 25px 30px;
  margin: 0 auto 25px;
  margin-top: 50px;
  -moz-border-radius: 2px;
  -webkit-border-radius: 2px;
  border-radius: 2px;
  -moz-box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.3);
  -webkit-box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.3);
  box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.3);
}

.profile-img-card {
  width: 96px;
  height: 96px;
  margin: 0 auto 10px;
  display: block;
  -moz-border-radius: 50%;
  -webkit-border-radius: 50%;
  border-radius: 50%;
}

.background{
  background: #fffcbe;
  padding-top: 10%;

  min-height: 900px;
}
</style>
