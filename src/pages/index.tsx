import type { GetStaticProps } from 'next'
import { GetContributorStats } from 'services/Github'

interface Props {
}

export default function Home(props: Props) {
  return (
    <div>
      Index Page
    </div>
  )
}

export const getStaticProps: GetStaticProps<Props> = async () => {
  // test accounts: gakonst GregTheGreek ligi timbeiko karalabe
  const stats = await GetContributorStats('karalabe')

  return {
    props: {}
  }
}
