const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');


const packageDef = protoLoader.loadSync("todo.proto", {}); // Package definition from the proto file
const grpcObj = grpc.loadPackageDefinition(packageDef); // grpc object from the packageDef
const todoPackage = grpcObj.todoPackage; //grpc todoPackage

const text = process.argv[2]
const client = new todoPackage.Todo("localhost:50051", grpc.credentials.createInsecure());

client.createTodo({
    "id": -1,
    "text": text
}, (err, res) => {
    console.log("Received from server ", JSON.stringify(res));
})


client.readTodos({

}, (err, res) => {
    console.log("Read from server ", JSON.stringify(res));
})

const call = client.readTodosStream();
call.on("data", item => {
    console.log("received item from server .." + JSON.stringify(item));
})

call.on("end", e => console.log("server done!!"))