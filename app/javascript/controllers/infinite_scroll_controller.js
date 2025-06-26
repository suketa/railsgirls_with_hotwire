import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["container", "trigger"]
  static values = { 
    url: String,
    page: { type: Number, default: 1 },
    loading: { type: Boolean, default: false }
  }

  connect() {
    this.observer = new IntersectionObserver(this.handleIntersect.bind(this), {
      threshold: 0.1
    })
    
    if (this.hasTriggerTarget) {
      this.observer.observe(this.triggerTarget)
    }
  }

  disconnect() {
    if (this.observer) {
      this.observer.disconnect()
    }
  }

  handleIntersect(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting && !this.loadingValue) {
        this.loadMore()
      }
    })
  }

  async loadMore() {
    if (this.loadingValue) return
    
    this.loadingValue = true
    this.pageValue += 1

    try {
      const response = await fetch(`${this.urlValue}?page=${this.pageValue}`, {
        headers: {
          "Accept": "text/vnd.turbo-stream.html"
        }
      })

      if (response.ok) {
        const html = await response.text()
        Turbo.renderStreamMessage(html)
      }
    } catch (error) {
      console.error("Failed to load more comments:", error)
    } finally {
      this.loadingValue = false
    }
  }

  triggerTargetConnected() {
    if (this.observer) {
      this.observer.observe(this.triggerTarget)
    }
  }

  triggerTargetDisconnected() {
    if (this.observer) {
      this.observer.unobserve(this.triggerTarget)
    }
  }
}