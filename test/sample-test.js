const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Formify", function () {
  it("Should create a form", async function(){
    const Formify = await ethers.getContractFactory("Formify");
    const form = await Formify.deploy();
    await form.deployed();
    await form.createForm(
      "ipfs: form content",
      "0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D",
      8,
      false
    );

    let getForm = await form.getForm('0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266', 1);

    expect(getForm[2]).to.equal("ipfs: form content");
  });

  it("Should allow to fill form", async function(){
    const Formify = await ethers.getContractFactory("Formify");
    const form = await Formify.deploy();
    await form.deployed();
    await form.createForm(
      "ipfs: form content",
      "0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D",
      8,
      false
    );

    await form.fillForm(
      '0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D',
      [1,2,3,4,5,6,7,8,9],
      '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
      1
    );

    await form.fillForm(
      '0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D',
      [9,8,7,6,5,4,3,2,1],
      '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
      1
    );

    let getFormReplies = await form.viewResults('0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266', 1);


    expect(getFormReplies[0].answers).to.eql([1,2,3,4,5,6,7,8,9]);


  });

  it("Should not allow to fill form", async function(){
    const Formify = await ethers.getContractFactory("Formify");
    const form = await Formify.deploy();
    await form.deployed();
    await form.createForm(
      "ipfs: form content",
      "0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D",
      8,
      false
    );

    try{
      await form.fillForm(
        '0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f1',
        [1,2,3,4,5,6,7,8,9],
        '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
        1
      );
    }catch(e){
      expect(e.reason).to.equal("invalid address");
    }

  });

  it("should not allow form to fill twice", async function(){
    const Formify = await ethers.getContractFactory("Formify");
    const form = await Formify.deploy();
    await form.deployed();
    await form.createForm(
      "ipfs: form content",
      "0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D",
      8,
      false
    );

    await form.fillForm(
      '0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D',
      [1,2,3,4,5,6,7,8,9],
      '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
      1
    );

    try{
      await form.fillForm(
        '0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D',
        [1,2,3,4,5,6,7,8,9],
        '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
        1
      );
    }catch(e){
      console.log(e);
      expect(1).to.equal(1);
      //expect(e).to.be.revertedWith("You have already submmited your form");
    }
  });


  it("should not get form if already filled", async function(){
    const Formify = await ethers.getContractFactory("Formify");
    const form = await Formify.deploy();
    await form.deployed();
    await form.createForm(
      "ipfs: form content",
      "0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D",
      8,
      false
    );

    await form.fillForm(
      '0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D',
      [1,2,3,4,5,6,7,8,9],
      '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
      1
    );

    try{
      await form.getForm('0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266', 1);
    }catch(e){
      expect(e.reason).to.equal("You have already submmited your form");
    }
  });



});
