import { Packet } from './Packet';

class Server {
  constructor(name) {
    this.name = name; // server name
    this.x = null; // server x postion
    this.y = null; // server y position
  }

  broadcastPropose(servers, value) {
    const id = Date.now();
    return servers.map((server, i) => {
      return this.propose(server, id + i, value)
    })
  }

  propose(server, id, value) {
    const packet = new Packet(this, server)
    packet.id = id;
    return packet;
  }
};

export { Server };