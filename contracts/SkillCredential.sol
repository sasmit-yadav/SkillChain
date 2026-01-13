// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract SkillCredential is ERC721, ERC721URIStorage, Ownable {
    uint256 private _nextTokenId;
    
    struct CredentialData {
        string skillName;
        uint256 skillScore;
        uint256 timestamp;
    }
    
    mapping(uint256 => CredentialData) public credentials;
    
    event CredentialMinted(
        uint256 indexed tokenId,
        address indexed to,
        string skillName,
        uint256 skillScore,
        uint256 timestamp
    );
    
    constructor(address initialOwner) ERC721("SkillCredential", "SKILL") Ownable(initialOwner) {}
    
    function mintCredential(
        address to,
        string memory skillName,
        uint256 skillScore
    ) public returns (uint256) {
        uint256 tokenId = _nextTokenId++;
        _safeMint(to, tokenId);
        
        credentials[tokenId] = CredentialData({
            skillName: skillName,
            skillScore: skillScore,
            timestamp: block.timestamp
        });
        
        emit CredentialMinted(
            tokenId,
            to,
            skillName,
            skillScore,
            block.timestamp
        );
        
        return tokenId;
    }
    
    function getCredential(uint256 tokenId) public view returns (
        string memory skillName,
        uint256 skillScore,
        uint256 timestamp
    ) {
        require(_ownerOf(tokenId) != address(0), "Credential does not exist");
        CredentialData memory cred = credentials[tokenId];
        return (cred.skillName, cred.skillScore, cred.timestamp);
    }
    
    // The following functions are overrides required by Solidity.
    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }
    
    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}

