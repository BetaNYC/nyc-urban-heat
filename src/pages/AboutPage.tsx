import Nav from "../components/Nav"
import Banner from "../components/Banner"

const AboutPage = () => {
  return (
    <>
      <Nav />
      <Banner title="About" tags={[]} content="Learn more about the NYC Urban Heat Portal and the team that created it." />
      <div className="flex justify-center py-9">
        <div className="px-5 container">
          <div className="mb-12">
            <h1 className="mb-2 font-semibold text-headline">About the project</h1>
            <p className="font-light text-small">The NYC Urban Heat Portal was created by a team of researchers with urban heat island, microclimate, design and planning, statistical, and computational expertise. The tool combines several sources of ecological, meteorological, remote sensing, and GIS (Geographic Information System) data specific to New York City. This project was partially funded by NASA's Applied Sciences program.</p>
          </div>
          <div>
            <div className="mb-2">
              <h1 className="mb-2 font-semibold text-headline">Team</h1>
            </div>
            <div className="mb-4">
              <h2 className="mb-1 font-semibold text-subheadline">Hunter College</h2>
              <p className="font-light text-small">Mehdi Heris, project lead</p>
              <p className="font-light text-small">Peter Marcotullio, science collaborator</p>
              <p className="font-light text-small">Andrew Reinman, science collaborator</p>
            </div>
            <div className="mb-4">
              <h2 className="mb-1 font-semibold text-subheadline">The Pennsylvania State University</h2>
              <p className="font-light text-small">Travis Flohr</p>
            </div>
            <div className="mb-4">
              <h2 className="mb-1 font-semibold text-subheadline">BetaNYC</h2>
              <p className="font-light text-small">Ashley Louie, former Chief Technology Officer</p>
              <p className="font-light text-small">Hao Lun Hung, Frontend Development</p>
              <p className="font-light text-small">Hailee Luong, User Experience Design</p>
              <p className="font-light text-small">Zhi Keng He, Software Engineering</p>
              <p className="font-light text-small">Andrew Kittredge, Civic Innovation Lab Director</p>
            </div>
            <div className="mb-4">
              <h2 className="mb-1 font-semibold text-subheadline">Acknowledgements</h2>
              <p className="mb-1 selection:font-light text-small">Special thanks to the community-based groups that supported the creation of the NYC Urban Heat Portal through feedback in interviews and workshops.</p>
              <p className="font-light text-small">Mayor's Office of Climate and Environmental Justice</p>
              <p className="font-light text-small">WE ACT</p>
              <p className="font-light text-small">I LOVE Greenville</p>
              <p className="font-light text-small">El Puente</p>
              <p className="font-light text-small">South Bronx Unite</p>
              <p className="font-light text-small">Natural Resources Defense Council</p>
              <p className="font-light text-small">East New York Community Land Trust</p>
              <p className="font-light text-small">Neighbors for a Greener Harlem</p>
              <p className="font-light text-small">New York City Environmental Justice Alliance</p>
            </div>
          </div>
        </div>
      </div>
    </>

  )
}

export default AboutPage