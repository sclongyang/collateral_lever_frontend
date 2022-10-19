import { ConnectButton } from "web3uikit"
import Link from "next/link"

export default function Header() {
    return (
        <nav className="p-5 border-b-2 flex flex-row justify-between items-center">
            <h1 className="py-4 px-4 font-bold text-3xl">Collateral Lever</h1>
            <div className="mr-4 p-6 text-2xl">数据常有延迟, 请按F5手动刷新</div>
            <div className="flex flex-row items-center">
                <Link href="/">
                    <a className="mr-4 p-6 text-3xl">开仓</a>
                </Link>
                <Link href="/close_position">
                    <a className="mr-4 p-6 text-3xl">平仓</a>
                </Link>
                <ConnectButton moralisAuth={false} />
            </div>
        </nav>
    )
}
