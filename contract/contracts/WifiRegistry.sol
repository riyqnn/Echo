// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract WifiRegistry {
    struct Hotspot {
        uint256 id;
        address owner;
        string ssid;
        string location;
        uint256 pricePerMB; // price per MB in wei
        bool active;
    }

    struct AccessVoucher {
        uint256 hotspotId;
        uint256 quotaMB;
        uint256 expiry;
        string accessCode;
    }

    Hotspot[] public hotspots;                       // array of hotspots (easier to read from UI)
    mapping(address => AccessVoucher) public vouchers; // voucher per user

    event HotspotRegistered(uint256 indexed id, address indexed owner, string ssid, string location, uint256 pricePerMB);
    event AccessPurchased(address indexed user, uint256 indexed hotspotId, string accessCode, uint256 quotaMB, uint256 expiry);
    event VoucherUsed(address indexed user, uint256 indexed hotspotId);
    event HotspotActivated(uint256 indexed id, bool active);
    event FundsWithdrawn(address indexed owner, uint256 amount);

    /* ========== WRITE FUNCTIONS (state-changing) ========== */

    // Register hotspot (owner registers their hotspot)
    function registerHotspot(string calldata _ssid, string calldata _location, uint256 _pricePerMB) external {
        uint256 id = hotspots.length;
        hotspots.push(Hotspot({
            id: id,
            owner: msg.sender,
            ssid: _ssid,
            location: _location,
            pricePerMB: _pricePerMB,
            active: true
        }));

        emit HotspotRegistered(id, msg.sender, _ssid, _location, _pricePerMB);
    }

    // Owner can activate/deactivate their hotspot
    function setHotspotActive(uint256 _hotspotId, bool _active) external {
        require(_hotspotId < hotspots.length, "Hotspot not exist");
        Hotspot storage hs = hotspots[_hotspotId];
        require(msg.sender == hs.owner, "Not owner");
        hs.active = _active;
        emit HotspotActivated(_hotspotId, _active);
    }

    // Buy access (user pays ETH = pricePerMB * quotaMB). durationSeconds sets expiry from now.
    // NOTE: For MVP we direct-transfer to owner immediately.
    function buyAccess(uint256 _hotspotId, uint256 _quotaMB, uint256 _durationSeconds) external payable {
        require(_hotspotId < hotspots.length, "Hotspot not exist");
        Hotspot memory hs = hotspots[_hotspotId];
        require(hs.active, "Hotspot not active");

        uint256 cost = hs.pricePerMB * _quotaMB;
        require(msg.value >= cost, "Insufficient payment");

        // Generate access code (deterministic pseudo-code for demo)
        string memory code = generateAccessCode(msg.sender, _hotspotId, block.timestamp);

        // store voucher for buyer (overwrites previous voucher for simplicity)
        vouchers[msg.sender] = AccessVoucher({
            hotspotId: _hotspotId,
            quotaMB: _quotaMB,
            expiry: block.timestamp + _durationSeconds,
            accessCode: code
        });

        // transfer funds to hotspot owner (immediate)
        (bool sent, ) = hs.owner.call{value: cost}("");
        require(sent, "Transfer failed");

        // if user sent extra ETH (msg.value > cost), keep the remainder in contract as credit for owner withdraw
        uint256 remainder = msg.value - cost;
        if (remainder > 0) {
            // keep remainder in contract balance (owner can withdraw later)
            // (we could map balances per owner but for MVP we emit event and allow owner withdraw entire contract balance)
        }

        emit AccessPurchased(msg.sender, _hotspotId, code, _quotaMB, block.timestamp + _durationSeconds);
    }

    // Mark voucher as used (simulates the hotspot / captive portal marking it as consumed)
    function useVoucher() external {
        AccessVoucher storage v = vouchers[msg.sender];
        require(v.expiry != 0, "No voucher");
        require(block.timestamp <= v.expiry, "Voucher expired");
        // For simplicity, mark expiry to zero to indicate used
        uint256 hotspotId = v.hotspotId;
        v.expiry = 0;
        emit VoucherUsed(msg.sender, hotspotId);
    }

    // Owner withdraw leftover contract balance (simple global withdraw for MVP)
    function withdrawFunds() external {
        uint256 bal = address(this).balance;
        require(bal > 0, "No funds");
        (bool sent, ) = msg.sender.call{value: bal}("");
        require(sent, "Withdraw failed");
        emit FundsWithdrawn(msg.sender, bal);
    }

    /* ========== READ (view) FUNCTIONS ========== */

    function getHotspotsCount() external view returns (uint256) {
        return hotspots.length;
    }

    function getHotspot(uint256 _id) external view returns (Hotspot memory) {
        require(_id < hotspots.length, "Hotspot not exist");
        return hotspots[_id];
    }

    // Return all hotspot ids & owners (careful gas for large arrays; OK for MVP demo)
    function getAllHotspots() external view returns (Hotspot[] memory) {
        return hotspots;
    }

    function getMyVoucher(address user) external view returns (AccessVoucher memory) {
        return vouchers[user];
    }

    // Helper: check if a user's voucher is currently valid
    function isVoucherValid(address user) external view returns (bool) {
        AccessVoucher memory v = vouchers[user];
        if (v.expiry == 0) return false;
        return block.timestamp <= v.expiry;
    }

    /* ========== UTILITIES ========== */

    // Pseudo-random deterministic access code (for demo only — not secure for production)
    function generateAccessCode(address user, uint256 _hotspotId, uint256 seed) internal pure returns (string memory) {
        // combine addr, hotspotId, seed -> hex-like string
        bytes32 h = keccak256(abi.encodePacked(user, _hotspotId, seed));
        return toHexString(h);
    }

    function toHexString(bytes32 data) internal pure returns (string memory) {
        bytes memory alphabet = "0123456789abcdef";
        bytes memory str = new bytes(2 + 64); // "0x" + 64 hex chars
        str[0] = "0";
        str[1] = "x";
        for (uint i = 0; i < 32; i++) {
            str[2 + i*2] = alphabet[uint8(data[i] >> 4)];
            str[3 + i*2] = alphabet[uint8(data[i] & 0x0f)];
        }
        return string(str);
    }

    // fallback to receive leftover ETH
    receive() external payable {}
}
