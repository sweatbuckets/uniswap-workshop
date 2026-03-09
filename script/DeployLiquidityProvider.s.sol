// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

interface INonfungiblePositionManager {
    struct MintParams {
        address token0; address token1; uint24 fee;
        int24 tickLower; int24 tickUpper;
        uint256 amount0Desired; uint256 amount1Desired;
        uint256 amount0Min; uint256 amount1Min;
        address recipient; uint256 deadline;
    }
    function mint(MintParams calldata params) external payable
        returns (uint256 tokenId, uint128 liquidity,
                 uint256 amount0, uint256 amount1);
    function createAndInitializePoolIfNecessary(
        address token0, address token1,
        uint24 fee, uint160 sqrtPriceX96
    ) external payable returns (address pool);
}

contract LiquidityProvider {
    INonfungiblePositionManager public immutable positionManager;

    constructor() {
        positionManager = INonfungiblePositionManager(
            0x1238536071E1c677A632429e3655c799b22cDA52
        );
    }

    /// @notice 풀 생성 + 초기화 (1:1 가격)
    function createPool(address tokenA, address tokenB, uint24 fee)
        external returns (address pool)
    {
        (address token0, address token1) = tokenA < tokenB
            ? (tokenA, tokenB) : (tokenB, tokenA);
        // sqrtPriceX96 = sqrt(1) * 2^96  →  1:1 가격
        uint160 sqrtPriceX96 = 79228162514264337593543950336;
        pool = positionManager.createAndInitializePoolIfNecessary(
            token0, token1, fee, sqrtPriceX96
        );
    }

    /// @notice 유동성 추가
    function addLiquidity(
        address tokenA, address tokenB, uint24 fee,
        uint256 amount0, uint256 amount1
    ) external returns (uint256 tokenId) {
        (address token0, address token1) = tokenA < tokenB
            ? (tokenA, tokenB) : (tokenB, tokenA);

        IERC20(token0).transferFrom(msg.sender, address(this), amount0);
        IERC20(token1).transferFrom(msg.sender, address(this), amount1);
        IERC20(token0).approve(address(positionManager), amount0);
        IERC20(token1).approve(address(positionManager), amount1);

        INonfungiblePositionManager.MintParams memory params =
            INonfungiblePositionManager.MintParams({
                token0: token0,       token1: token1,      fee: fee,
                tickLower: -887220,   // MIN_TICK (전체 범위)
                tickUpper:  887220,   // MAX_TICK (전체 범위)
                amount0Desired: amount0, amount1Desired: amount1,
                amount0Min: 0,       amount1Min: 0,
                recipient: msg.sender,
                deadline: block.timestamp + 600
            });

        (tokenId, , , ) = positionManager.mint(params);
    }
}

contract DeployLiquidityProvider is Script {
    function run() external returns (LiquidityProvider deployed) {
        vm.startBroadcast();
        deployed = new LiquidityProvider();
        console.log("LiquidityProvider:", address(deployed));
        vm.stopBroadcast();
    }
}
