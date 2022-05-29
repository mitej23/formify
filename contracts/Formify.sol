// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract Formify{

    // get forms of respective users
    mapping(address => mapping(uint8 => Form)) private usersToTheirForms;
    mapping (address => uint8) private usersToTotalFormsCount;

    struct FormReply{
        address respondentAddress;
        uint8[] answers;
    }
    
    struct Form{
        address formCreator;
        address gatedToken; // can be a token or nft
        string formHash;
        uint8 totalQuestions;
        mapping(address => uint256) respondentToTheirReply;
        FormReply[] replies;
        bool nftOrToken; // 0 -> nft || 1 -> token
    }

    // create form 
    function createForm(
        string memory _formHash, 
        address _gatedToken, 
        uint8 _totalQuestions, 
        bool _nftOrToken
    ) external {
        uint8 formsCount =  usersToTotalFormsCount[msg.sender] += 1;
        Form storage userForm = usersToTheirForms[msg.sender][formsCount];
        userForm.formCreator = msg.sender;
        userForm.gatedToken = _gatedToken;
        userForm.formHash = _formHash;
        userForm.totalQuestions = _totalQuestions;
        userForm.nftOrToken = _nftOrToken;
    }

    // get form using id ==> not gated
    function getForm(
        address _formAddress, 
        uint8 _formId
    ) external view returns(
        address,
        address,
        string memory,
        uint8,
        bool
    ){
        Form storage userForm = usersToTheirForms[_formAddress][_formId];
        require(userForm.respondentToTheirReply[msg.sender] == 0, "You have already submmited your form");
        return (
            userForm.formCreator, 
            userForm.gatedToken,
            userForm.formHash,
            userForm.totalQuestions,
            userForm.nftOrToken 
        );
    }

    // fill result 
    function fillForm(
        address _gatedToken, 
        uint8[] memory _answers, 
        address _formAddress, 
        uint8 _formId
    ) external{
        Form storage userForm = usersToTheirForms[_formAddress][_formId];
        require(userForm.gatedToken == _gatedToken, "Access Denied");
        require(userForm.respondentToTheirReply[msg.sender] == 0, "You have already submmited your form");
        uint256 length = userForm.replies.length;
        userForm.respondentToTheirReply[msg.sender] = length + 1;
        userForm.replies.push(FormReply(msg.sender, _answers));
    }

    // view results
    function viewResults(
        address _formAddress, 
        uint8 _formId
    ) external view returns (
        FormReply[] memory
    ){
        Form storage userForm = usersToTheirForms[_formAddress][_formId];
        return userForm.replies;
    }

    
}