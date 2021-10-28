// 插件的形式： 实现一个install方法， 在Vue.use()时会调用该方法

let Vue
class WmlVueRouter {
  constructor (options) {
    // 保存路由配置信息
    this.$options = options

    // current 需要设置成响应式
    Vue.util.defineReactive(this, 'current', window.location.hash.slice(1) || '/')

    // 监听hash 变化，需要响应式
    window.addEventListener('hashchange', () => {
      this.current = window.location.hash.slice(1) || '/'
      console.log(this.current)
    })
  }

  // 形参1 Vue构造函数
  static install (_Vue) {
    // 传入构造函数，可以修改其原型，起到扩展的作用（Vue.prototype.xx = xxx）
    Vue = _Vue

    // 1、注册$router
    // 延迟执行接下来的代码，等到router实例创建之后
    Vue.mixin(
      {
        beforeCreate () {
          // 这里的this指的是组件实例
          if (this.$options.router) { Vue.prototype.$router = this.$options.router }
        }
      }
    )

    Vue.component('router-link', {
      props: {
        to: {
          type: String,
          required: true
        }
      },
      // template: '<div></div>'  // runtime版本不能用，因为没有compiler
      render (h) {
        return h('a', {
          attrs: {
            href: '#' + this.to
          }
        }, this.$slots.default)
      }
    })

    // 内容的载体
    Vue.component('router-view', {
      render (h) {
        // 1 根据hash 获取path
        // 2 在路由表里根据path 找到component
        // 3 调用render函数渲染组件
        // console.log(this.$router.$options, this.$router.current)
        let component = null
        const route = this.$router.$options.routes.find(item => item.path === this.$router.current)
        if (route) {
          component = route.component
        }
        return h(component)
      }
    })
  }
}

export default WmlVueRouter
