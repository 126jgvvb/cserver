const database_controller=require('../controllers/database_controller');

jest.mock('../controllers/database_controller.js');


describe('checking database methods',()=>{
test('checking the start method',async()=>{
   expect(jest.isMockFunction(database_controller.start)).toBeTruthy;
    database_controller;
})


test('checking the analyze method',async ()=>{
    expect(jest.isMockFunction(database_controller.analyze)).toBeTruthy;
    database_controller;
})


test('checking the updateDatabase method',async()=>{
    expect(jest.isMockFunction(database_controller.updateDatabase)).toBeTruthy;
    database_controller;
})


test('checking the getAgents method',async()=>{
    expect(jest.isMockFunction(database_controller.getAgents)).toBeTruthy;
 //   await  database_controller.getAgents.returnMockValue('collectionName');
    database_controller;
})


test('checking the getAgentsToExcel method',async()=>{
    expect(jest.isMockFunction(database_controller.getAgentsToExcel)).toBeTruthy;
//  await  database_controller.getAgentsToExcel.returnMockValue('collectionName');
    database_controller;
})

test('checking the updateText method',async()=>{
    expect(jest.isMockFunction(database_controller.updateTextFile)).toBeTruthy;
//   await database_controller.updateTextFile.returnMockValue('collectionName',1);
    database_controller;
})

test('checking the readTextFile method',async()=>{
    expect(jest.isMockFunction(database_controller.readTextFile)).toBeTruthy;
 //  await database_controller.readTextFile.returnMockValue();
    database_controller;
})


})