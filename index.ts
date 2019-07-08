async function sleep(ms: number) {
    return new Promise((resolve, reject) => {
        setTimeout(() => resolve(), ms)
    })
}

async function randomDelay() {
    const randomTime = Math.round(Math.random() * 1000)
    return sleep(randomTime)
}

class ShipmentSearchIndex {
    async updateShipment(id: string, shipmentData: any) {
        const startTime = new Date()
        await randomDelay()
        const endTime = new Date()
        console.log(`update ${id}@${
            startTime.toISOString()
            } finished@${
            endTime.toISOString()
            }`
        )

        return { startTime, endTime }
    }
}

// Implementation needed
interface ShipmentUpdateListenerInterface {
    receiveUpdate(id: string, shipmentData: any)
}

interface Queue {
    [id: string]: any[]
}

interface Flags {
    [id: string]: boolean
}

class ShipmentUpdateListenerInterface implements ShipmentUpdateListenerInterface {
  private shipmentSearchIndex: ShipmentSearchIndex
  private queue: Queue
  private isInTheLoop: Flags

  constructor(ShipmentSearchIndex) {
    this.queue = {}
    this.isInTheLoop = {}
    this.shipmentSearchIndex = new ShipmentSearchIndex()
  }

  receiveUpdate(id: string, shipmentData: any) {
    this.addToQueue(id, shipmentData)

    if(!this.isInTheLoop[id]) {
      this.isInTheLoop[id] = true
      this.runUpdates(id)
    }
  }

  private addToQueue(id: string, shipmentData: any) {
    if(!this.queue[id])
      this.queue[id] = [shipmentData]
    else
      this.queue[id].push(shipmentData)
  }

  private async runUpdates(id: string) {
    while(this.queue[id].length > 0) {
      const shipmentData = this.queue[id][0]
      await this.shipmentSearchIndex.updateShipment(id, shipmentData)
      this.queue[id].shift()
    }

    this.isInTheLoop[id] = false
  }
}
