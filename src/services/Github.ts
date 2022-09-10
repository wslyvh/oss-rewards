import * as dotenv from 'dotenv'

dotenv.config()

if (!process.env.API_GITHUB_TOKEN) {
    throw new Error('Github API Token not set.')
}

const sinceYear = 2014
const orgs = [
    // Protocol
    'ethereum',
    // Applied ZK
    'privacy-scaling-explorations',
    'semaphore-protocol',
    'zkopru-network',
    'quadratic-funding',
    'web3well',
    'Zokrates',
    // Dev tooling & infra
    'NomicFoundation',
    'dethcrypto',
    'crytic',
    'scaffold-eth',
    'blockchain-etl',
    'ethereum-lists',
    'ChainAgnostic',
    'Web3Modal',
    'TrueFiEng',
    'goerli',
    'WalletConnect',
    // Libs & SDKs
    'eth-brownie',
    'dapphub',
    'foundry-rs',
    'vyperlang',
    'ethereumjs',
    'ethers-io',
    'web3ui',
    'web3p',
    'web3j',
    // CL
    'prysmaticlabs',
    'sigp',
    'ConsenSys',
    'status-im',
    'ChainSafe', // Prysm, Lighthouse, Teku, Nimbus, lodestar
    // EL:
    'ledgerwatch',
    'NethermindEth',
    'hyperledger', // 'ethereum' (geth), Erigon, Nethermind, Besu
    // L2/scalability:
    'l2beat',
    'ethereum-optimism',
    'OffchainLabs',
    'matter-labs',
    'hermeznetwork',
    'maticnetwork',
    'AztecProtocol',
]

export async function GetContributorStats(username: string) {
    console.log(`Get Contributor Stats '${username}'`)

    let index = 1
    let keys = 'xxxxxxxxxx'
    let queryPerYear = ''
    for (let year = sinceYear; year <= new Date().getFullYear(); year++) {
        console.log('Querying', year)
        queryPerYear += `
            ${keys.substring(0, index)}:contributionsCollection(from: "${year}-01-01T00:00:00Z" , to:"${year}-12-31T23:59:59Z") {
                pullRequestContributionsByRepository {
                    contributions(first: 100) {
                        totalCount
                        nodes {
                            pullRequest {
                                merged
                            }
                        }
                    }
                    repository {
                        stargazerCount
                        name
                        nameWithOwner
                        owner {
                            login
                        }
                    }
                }
            }`

        index++
    }

    const response = await fetch('https://api.github.com/graphql', {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${process.env.API_GITHUB_TOKEN}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            query: `{
                user(login: "${username}") {
                    ${queryPerYear}
                }
            }`,
        }),
    })

    const body: any = await response.json()
    const results = Object.keys(body.data.user)
        .map(key => body.data.user[key].pullRequestContributionsByRepository).flat()
        .filter(i => i.contributions.nodes.some((x: any) => x.pullRequest.merged))
        .filter(i => i.repository.owner.login === 'ethereum')
        /// .filter(i => orgs.map(i => i.toLowerCase()).includes(i.repository.owner.login.toLowerCase()))

    // console.log('RESULTS', results)

    const nrOfContributions = results
        .map(i => i.contributions.nodes.map((x: any) => x.pullRequest.merged)).flat()
        .filter(i => i).length
    console.log('# of Merged contributions', nrOfContributions)

    const nrOfRepos = [...new Set(results.map(i => i.repository.nameWithOwner))].length
    console.log('# of Repos contributed to', nrOfRepos)
}