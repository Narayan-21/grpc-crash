const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');


const packageDef = protoLoader.loadSync("todo.proto", {}); // Package definition from the proto file
const grpcObj = grpc.loadPackageDefinition(packageDef);  // grpc object from the packageDef
const todoPackage = grpcObj.todoPackage; //grpc todoPackage

const todos = []
function createTodo(call, callback) {
    console.log('inside createTodos!!')
    // console.log(call);
    const todoItem = {
        "id": todos.length + 1,
        "text": call.request.text
    }
    todos.push(todoItem);
    callback(null, todoItem)
}

function readTodos(call, callback) {
    console.log('inside readTodos!!')
    // console.log(call); // as an input from the client
    callback(null, {"items": todos}) // the thing that needs to be sent back to the client
}

function readTodosStream(call, callback) {
    todos.forEach(t => call.write(t));
    call.end();
}

function main() {
    var server = new grpc.Server();
    server.addService(todoPackage.Todo.service, {
        "createTodo": createTodo,
        "readTodos": readTodos,
        "readTodosStream": readTodosStream 
    });
    server.bindAsync('0.0.0.0:50051', grpc.ServerCredentials.createInsecure(), (err, port) => {
      if (err != null) {
        return console.error(err);
      }
      console.log(`gRPC listening on ${port}`)
    });
  }
  
  main();