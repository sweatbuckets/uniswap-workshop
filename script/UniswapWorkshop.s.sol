// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/BayToken.sol";
import "../src/StarToken.sol";
import "../src/LiquidityProvider.sol";

interface ISwapRouter {
    struct ExactInputSingleParams {
        address tokenIn; address tokenOut; uint24 fee;
        address recipient;
        uint256 amountIn; uint256 amountOutMinimum;
        uint160 sqrtPriceLimitX96;
    }
    function exactInputSingle(ExactInputSingleParams calldata params)
        external payable returns (uint256 amountOut);
}

contract UniswapWorkshop is Script {
    address constant SWAP_ROUTER = 0x3bFA4769FB09eefC5a80d6E87c3B9C650f7Ae48E;
    

    function run() external {
        vm.startBroadcast();

        // 1. 토큰 배포
        BayToken bay   = new BayToken();
        StarToken star = new StarToken();
        console.log("BAY:", address(bay));
        console.log("STAR:", address(star));

        // 2. LiquidityProvider 배포
        LiquidityProvider lp = new LiquidityProvider();

        // 3. 풀 생성
        address pool = lp.createPool(address(bay), address(star), 3000);
        console.log("Pool:", pool);

        // 4. Approve + 유동성 추가
        uint256 lpAmount = 10_000 * 1e18;
        bay.approve(address(lp), lpAmount);
        star.approve(address(lp), lpAmount);
        uint256 tokenId = lp.addLiquidity(
            address(bay), address(star), 3000, lpAmount, lpAmount
        );
        console.log("Position NFT ID:", tokenId);

        // 5. Swap: BAY → STAR
        uint256 swapAmount = 100 * 1e18;
        bay.approve(SWAP_ROUTER, swapAmount);
        uint256 amountOut = ISwapRouter(SWAP_ROUTER).exactInputSingle(
            ISwapRouter.ExactInputSingleParams({
                tokenIn: address(bay), tokenOut: address(star),
                fee: 3000, recipient: msg.sender,
                amountIn: swapAmount,
                amountOutMinimum: 0, sqrtPriceLimitX96: 0
            })
        );
        console.log("Swapped BAY -> STAR:", amountOut);

        vm.stopBroadcast();
    }
}