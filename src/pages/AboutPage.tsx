import Nav from "../components/Nav"
import Banner from "../components/Banner"

const AboutPage = () => {
  return (
    <>
      <Nav />
      <Banner title="About" tags={[]}/>
      <div className="flex justify-center pt-9">
        <div className="px-5 container">
          <div className="mb-12">
            <h1 className="mb-2 font-semibold text-headline">About the project</h1>
            <p className="font-light text-small">Lorem, ipsum dolor sit amet consectetur adipisicing elit. Ducimus optio, porro magni iure asperiores totam, quod nihil dolorem maxime provident iusto facere quasi, voluptates sapiente pariatur laborum nesciunt veniam rerum!</p>
          </div>
          <div>
            <div className="mb-[1.563rem]">
              <h1 className="mb-2 font-semibold text-headline">Team</h1>
              <p className="font-light text-small">NASA</p>
              <p className="font-light text-small">Hunter College, The City University of new York</p>
              <p className="font-light text-small">Penn State</p>
              <p className="font-light text-small">NYC Mayor's Office if Climate & Environmental Justice</p>
              <p className="font-light text-small">WE ACT for Environmental Justice</p>
              <p className="font-light text-small">I heart grn vlie</p>
            </div>
            <div className="">
              <h2 className="mb-2 font-semibold text-subheadline">BetaNYC</h2>
              <p className="mb-4 font-light text-small">
                oA partner project of the Fund for the City of New York, BetaNYC is a civic organization dedicated to improving lives in New York through civic design, technology, and data. This  project was designed and developed by BetaNYC’s Civic Innovation Lab in collaboration with [_____], through a BetaNYC service called Research and Data Assistance Request (RADAR). To learn more about RADARs and how to submit a request, visit: <a href="beta.nyc/radar" className="underline font-light text-small hover:text-[#EB583B]">beta.nyc/radar</a>.
              </p>
              <h3 className="font-semibold text-small">BetaNYC Civic Innovation Lab Team</h3>
              <p className="font-light text-small">Ashley Louie (Director), Hao Lun Hung, Zhi Keng He, Hailee Hoa Luong</p>
            </div>
          </div>
        </div>
      </div>
    </>

  )
}

export default AboutPage