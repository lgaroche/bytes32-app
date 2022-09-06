import { ConnectExtension } from "@magic-ext/connect";
import { Wallet } from "@rainbow-me/rainbowkit";
import { ethers, providers } from "ethers";
import { Magic } from "magic-sdk";
import { chain, Chain, Connector, ConnectorData } from "wagmi"

export class MagicConnector extends Connector {
    readonly id = "magicConnect";
    readonly name = "Magic Connect";
    readonly ready = true;

    readonly magic?: Magic

    readonly provider: providers.Provider

    constructor({ chains, options, }: {
        chains?: Chain[];
        options: Options;
    }) {
        super({ chains, options })
        if (typeof window !== "undefined") {
            this.magic = new Magic("", {
                extensions: [new ConnectExtension()],
                network: "rinkeby",
            })

            this.provider = new ethers.providers.Web3Provider(this.magic.rpcProvider)
            console.log(this.provider)
        } else {
            this.provider = ethers.providers.getDefaultProvider()
        }

    }

    async connect(config?: { chainId?: number | undefined; } | undefined): Promise<Required<ConnectorData<any>>> {
        console.log("connect magic")
        const chain = {
            id: 5,
            unsupported: false
        }
        return {
            account: await this.getAccount(),
            chain,
            provider: this.provider
        }

    }
    disconnect(): Promise<void> {
        console.log(this.magic)
        this.magic.connect.disconnect()
    }
    async getAccount(): Promise<string> {
        const accounts = await this.provider.listAccounts()
        console.log(accounts)
        return accounts[0]
    }
    getChainId(): Promise<number> {
        throw new Error("Method not implemented.");
    }
    async getProvider(config?: { chainId?: number | undefined; } | undefined): Promise<any> {
        return this.provider
    }
    async getSigner(config?: { chainId?: number | undefined; } | undefined): Promise<any> {
        return await this.provider.getSigner()
    }
    async isAuthorized(): Promise<boolean> {
        try {
            const account = await this.getAccount()
            return !!account
        } catch {
            return false
        }
    }
    protected onAccountsChanged(accounts: string[]): void {
        throw new Error("Method not implemented.");
    }
    protected onChainChanged(chain: string | number): void {
        throw new Error("Method not implemented.");
    }
    protected onDisconnect(error: Error): void {
        throw new Error("Method not implemented.");
    }

}

export interface MagicOptions {
    chains: Chain[];
}

export const magic = ({ chains }: MagicOptions): Wallet => ({
    id: 'magic',
    name: 'Magic',
    iconBackground: "",
    iconUrl: "",
    createConnector: () => {
        return {
            connector: new MagicConnector({ chains: [chain.rinkeby], options: {} })
        }
    }
})