import React, { ReactNode } from 'react'
import { TITLE, DESCRIPTION } from 'utils/constants'

type Props = {
    children: ReactNode
}

export function Layout(props: Props) {
    return <div>
        <header>
            <h1 className="text-2xl font-bold">{TITLE}</h1>
            <p>{DESCRIPTION}</p>
        </header>

        <main>{props.children}</main>

        <footer>
            Footer
        </footer>
    </div>
}
