//SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

//import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Base64.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

// transfer/onTransfer = reset tokenId stats 

contract Collectible is ERC721, ERC721Enumerable, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIdCounter;

    struct Contributor { 
        uint8 tribeId;
        uint16 nrOfContributions;
        uint16 nrOfProjects;
    }

	mapping (uint256 => Contributor) public contributors;

    // SDP (Starship) or ODP (Open) Developer Passport
    constructor() ERC721("Collectible", "SDP") {}

    function safeMint(address to, uint8 tribeId, uint16 nrOfContributions, uint16 nrOfProjects) public onlyOwner {
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        contributors[tokenId].tribeId = tribeId;
        contributors[tokenId].nrOfContributions = nrOfContributions;
        contributors[tokenId].nrOfProjects = nrOfProjects;
        _safeMint(to, tokenId);
    }

	function tokenURI(uint256 id) public view override returns (string memory) {
        require(_exists(id), "ERC721Metadata: URI query for nonexistent token");

        bytes memory dataURI = abi.encodePacked(
            '{',
                '"name": "Starship #', Strings.toString(id), '",',
                '"description": "Your On-chain Developer Passport",',
                '"image": "', generateSvg(id), '",',
                '"attributes": {',
                    '"tribe": ', Strings.toString(contributors[id].tribeId),','
                    '"contributions": ', Strings.toString(contributors[id].nrOfContributions),','
                    '"projects": ', Strings.toString(contributors[id].nrOfProjects),
                '}'
            '}'
        );

        return string(
            abi.encodePacked(
                "data:application/json;base64,",
                Base64.encode(dataURI)
            )
        );
	}

    function generateSvg(uint256 id) public view returns(string memory) {
        bytes memory svg;

        // Solarpunk
        if (contributors[id].tribeId == 1) {
            svg = abi.encodePacked(
                '<svg width="500" height="500" xmlns="http://www.w3.org/2000/svg">'
                '<g id="Solarpunk">'
                '<rect fill="url(#svg_9)" stroke="#000" x="0" y="0" width="500" height="500" id="svg_1"/>'
                '<text fill="#000000" stroke="#000" x="107" y="150" id="svg_3" stroke-width="0" font-size="49" font-family="monospace" text-anchor="start" xml:space="preserve">Solarpunk</text>'
                '<text fill="#000000" stroke="#000" x="117.39999" y="375" id="svg_5" stroke-width="0" font-size="24" font-family="monospace" text-anchor="start" xml:space="preserve">Contributions: ', Strings.toString(contributors[id].nrOfContributions),'</text>'
                '<text fill="#000000" stroke="#000" x="164.2" y="421" id="svg_6" stroke-width="0" font-size="24" font-family="monospace" text-anchor="start" xml:space="preserve">Projects: ', Strings.toString(contributors[id].nrOfProjects),'</text>'
                '</g>'
                '<defs>'
                '<linearGradient spreadMethod="pad" y2="0.65" x2="0.65" y1="0" x1="0" id="svg_9">'
                '<stop stop-opacity="0.99609" stop-color="#3f7f00" offset="0"/>'
                '<stop stop-opacity="0.99609" stop-color="#ffffaa" offset="1"/>'
                '</linearGradient>'
                '</defs>'
                '</svg>'
            );
        }
        // Lunarpunk
        else if (contributors[id].tribeId == 2) {
            svg = abi.encodePacked(
                '<svg width="500" height="500" xmlns="http://www.w3.org/2000/svg">'
                '<g id="Lunarpunk">'
                '<rect id="svg_1" height="500" width="500" y="0" x="0" stroke="#000" fill="url(#svg_2)"/>'
                '<text xml:space="preserve" text-anchor="start" font-family="monospace" font-size="49" stroke-width="0" id="svg_3" y="150" x="107" stroke="#000" fill="#000000">Lunarpunk</text>'
                '<text transform="matrix(1, 0, 0, 1, 0, 0)" style="cursor: move;" xml:space="preserve" text-anchor="start" font-family="monospace" font-size="24" stroke-width="0" id="svg_5" y="375" x="117.39999" stroke="#000" fill="#000000">Contributions: ', Strings.toString(contributors[id].nrOfContributions),'</text>'
                '<text transform="matrix(1, 0, 0, 1, 0, 0)" xml:space="preserve" text-anchor="start" font-family="monospace" font-size="24" stroke-width="0" id="svg_6" y="421" x="164.2" stroke="#000" fill="#000000">Projects: ', Strings.toString(contributors[id].nrOfProjects),'</text>'
                '</g>'
                '<defs>'
                '<radialGradient spreadMethod="pad" id="svg_2">'
                '<stop offset="0" stop-color="#000000"/>'
                '<stop offset="1" stop-color="#fff"/>'
                '</radialGradient>'
                '</defs>'
                '</svg>'
            );
        }
        else { 
            svg = abi.encodePacked(
                '<svg width="500" height="500" xmlns="http://www.w3.org/2000/svg">'
                '<g id="Layer_1">'
                '<title>Claim</title>'
                '<rect fill="#ff5656" stroke="#000" x="0" y="0" width="500" height="500" id="svg_1"/>'
                '<text transform="matrix(1, 0, 0, 1, 0, 0)" xml:space="preserve" text-anchor="start" font-family="monospace" font-size="24" stroke-width="0" id="svg_11" y="213" x="109.60001" stroke="#000" fill="#000000">Connect account at</text>'
                '<text transform="matrix(1, 0, 0, 1, 0, 0)" xml:space="preserve" text-anchor="start" font-family="monospace" font-size="16" id="svg_12" y="270" x="125.2" fill="#000000">https://starship.claims/</text>'
                '</g>'
                '</svg>'
            );
        }

        return string(
            abi.encodePacked(
                "data:image/svg+xml;base64,",
                Base64.encode(svg)
            )    
        );
    }

    function _beforeTokenTransfer(address from, address to, uint256 tokenId)
        internal
        override(ERC721, ERC721Enumerable)
    {
        super._beforeTokenTransfer(from, to, tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721Enumerable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
