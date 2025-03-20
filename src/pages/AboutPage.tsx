import Nav from "../components/Nav"
import Banner from "../components/Banner"

const AboutPage = () => {
  return (
    <>
      <Nav />
      <Banner title="About" tags={[]} content="Learn more about the NYC Urban Heat Portal and the team that created it." />
      <div className="flex justify-center py-9">
        <div className="px-5 container">
          <div className="mb-8">
            <h1 className="mb-2 font-semibold text-headline">About the project</h1>
            <p className="font-light text-small">Higher temperatures in urban areas pose risks to public health and will continue to be intensified as temperatures increase globally. This raises important questions for planners and environmental justice advocates. What is the intensity of heat in the city? Who is affected the most? How can we understand and measure it? And how can we mitigate it?
              We know that there is a lot of confusion around different types of temperatures, such as surface temperature, air temperature, air heat index, and mean radiant temperature. Each of these measures paints one part of urban heat science. To understand how heat is distributed, we need to understand these and combine them.

              Our team of researchers designed the New York City Urban Heat Portal with the goal of making urban heat data accessible to empower community groups and policymakers with their planning and advocacy strategies.

              The NYC Urban Heat Portal maps and visualizes several temperature measures for heat exposure to offer actionable insights in comparable profiles. To measure the overall risk of heat exposure in neighborhoods across New York City, the Outdoor Heat Exposure Index combines outdoor environmental factors, including mean radiant temperature, surface temperature, cool roofs, tree canopy, and permeable surfaces. Daily weather station data during summer months can also be explored to compare locations with more days per year (between 2013-2023) that qualify for extreme heat advisory conditions.

              Data visualized on the NYC Urban Heat Portal is available for download in multiple formats for stakeholders to use the data to conduct further research and analysis to support efforts to raise awareness, mobilize communities, and influence policy.</p>
          </div>
          <div className="mb-8">
            <div className="mb-2">
              <h1 className="mb-2 font-semibold text-headline">Team</h1>
            </div>
            <div className="mb-2">
              <h2 className="mb-1 font-semibold text-subheadline">Urban Heat Science and Data Preparation</h2>
              <p className="font-light text-small">Mehdi P. Heris; Hunter College</p>
              <p className="font-light text-small">Travis Flohr; Penn State University</p>
              <p className="font-light text-small">Artem Pankin; Hunter College</p>
              <p className="font-light text-small">Andrew Kittredge; Hunter College</p>
              <p className="font-light text-small">Peter Marcotullio; Hunter College</p>
              <p className="font-light text-small">Andrew Reinman; Hunter College</p>
            </div>
            <div className="mb-2">
              <h2 className="mb-1 font-semibold text-subheadline">NYC Urban Heat Portal Design, Data Visualization & Web Development </h2>
              <p className="font-light text-small">Ashley Louie, former Chief Technology Officer, BetaNYC</p>
              <p className="font-light text-small">Hao Lun Hung, Frontend Development, BetaNYC</p>
              <p className="font-light text-small">Hailee Luong, User Experience Design, BetaNYC</p>
              <p className="font-light text-small">Zhi Keng He, Software Engineering, BetaNYC</p>
              <p className="font-light text-small">Andrew Kittredge, Civic Innovation Lab Director, BetaNYC</p>
            </div>
            <div className="mb-4">
              <h2 className="mb-1 font-semibold text-subheadline">Interviews, Advocacy</h2>
              <p className="font-light text-small">Hunter College</p>
              <p className="font-light text-small">Marisa Valley</p>
              <p className="font-light text-small">Haijing Liu</p>
            </div>
          </div>
          <div>
            <div className="mb-2">
              <h1 className="mb-2 font-semibold text-headline">Acknowledgements</h1>
            </div>
            <div className="mb-4">
              <h2 className="mb-1 font-semibold text-subheadline"></h2>
              <p className="mb-1 selection:font-light text-small">The NYC Urban Heat Portal was partially funded by NASA's Applied Sciences program.</p>
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