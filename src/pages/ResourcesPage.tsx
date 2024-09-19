import Nav from "../components/Nav"
import ResourceCard from "../components/ResourceCard"
import AdvocacyGroupsCard from "../components/AdvocacyGroupsCard"


const ResourcesPage = () => {
  return (
    <div className="w-full">
      <Nav />
      <div className="flex justify-center ">
        <div className="px-5 py-[2.5rem] container">
          <div className="pb-[4.5rem] border-b-[1px] border-[#C6C6C6]">
            <h1 className="mb-8 font-semibold text-headline">NYC Extreme Heat Resources</h1>
            <div className="grid grid-col-1 md:grid-cols-2 lg:grid-cols-3 gap-[2.5rem]">
              <ResourceCard title="NYC Cool Options">
                <p className="font-light text-small">When it's very hot, air conditioning will help keep you safe. If you don't have air conditioning, find a cool place to visit nearby, like a friend’s place, a mall, museum, coffee shop, library, or an NYC cooling center. When it's not scorching out but it's still hot, you can also cool off at parks, areas with shade, sprinklers, or pools.</p>
                <a href="https://finder.nyc.gov/coolingcenters/locations?mView=map" className="underline font-light text-small hover:text-[#EB583B]"></a>
              </ResourceCard>
              <ResourceCard title="Cool It! NYC">
                <p className="font-light text-small">New York City Department of Parks & Recreation
                  If you’re looking to beat the heat this summer, the NYC Parks guide will help you find places to stay cool! With our new Cool It! NYC map, you can find places all across the city to hydrate, refresh, and stay in the shade.</p>
                <a href="https://www.nycgovparks.org/about/health-and-safety-guide/cool-it-nyc" className="underline font-light text-small hover:text-[#EB583B]">https://www.nycgovparks.org/about/health-and-safety-guide/cool-it-nyc</a>
              </ResourceCard>
              <ResourceCard title="Extreme Heat: Beat the Heat!">
                <p className="font-light text-small">NYC Emergency Management
                  It is important to understand your risk to extreme heat and make a heat emergency plan that works for you and your family.
                </p>
                <a href="https://www.nyc.gov/site/em/ready/extreme-heat.page" className="underline font-light text-small hover:text-[#EB583B]">https://www.nyc.gov/site/em/ready/extreme-heat.page</a>
              </ResourceCard>
              <ResourceCard title="Extreme Heat and Your Health">
                <p className="font-light text-small">NYC Health
                  Hot and humid weather is not just uncomfortable, it can cause heat illness and even death. The extra stress on the body from heat can also worsen chronic health conditions such as heart and lung disease. In NYC, most heatstroke deaths happened to people who were in homes without air conditioning. Air conditioning saves lives.
                </p>
                <a href="https://www.nyc.gov/site/doh/health/emergency-preparedness/emergencies-extreme-weather-heat.page" className="underline font-light text-small hover:text-[#EB583B]">https://www.nyc.gov/site/doh/health/emergency-preparedness/emergencies-extreme-weather-heat.page</a>
              </ResourceCard>
              <ResourceCard title="Heat Vulnerability Index">
                <p className="font-light text-small">NYC Environment & Health Data Portal
                </p>
                <a href="https://a816-dohbesp.nyc.gov/IndicatorPublic/data-features/hvi/" className="underline font-light text-small hover:text-[#EB583B]">https://a816-dohbesp.nyc.gov/IndicatorPublic/data-features/hvi/</a>
              </ResourceCard>
            </div>
          </div>
          <div className="pt-[2.5rem]">
            <h1 className="mb-8 font-semibold text-headline">Directory of Urban Heat Advocacy Groups</h1>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              <AdvocacyGroupsCard
                title="East New York Community Land Trust"
                content="The East New York Community Land Trust (ENY CLT) is a grassroots, people of color-led non-profit organization founded by community residents dedicated to preserving affordability for future generations and providing a vehicle to create generational wealth. We aim to protect, stabilize, and expand the stock of affordable homes, locally-owned small businesses, and green spaces in East New York and Brownsville to benefit low to moderate-income BIPOC residents. We use community organizing, education, and multi-generational engagement as the guiding forces of how we approach our work."
                url="https://www.eastnewyorkclt.org/" />
              <AdvocacyGroupsCard
                title="El Puente"
                content="El Puente has been at the forefront of social justice initiatives, blending artivism, youth development, and grassroots community building into our work for over 40 years and counting. Tackling everything from air quality to public safety initiatives and civic engagement. El Puente remains determined to nurturing the next generation of leaders and using the power of art to advocate for equitable community sustainability and self-determination."
                url="https://www.elpuente.us/"
              />
              <AdvocacyGroupsCard
                title="Mayor’s Office of Climate & Environmental Justice"
                content="MOCEJ works to make our buildings efficient and resilient, ensure our infrastructure is climate-ready, transform our streets and public realm into living, open spaces, and make our energy clean and resilient. Through science-based analysis, policy and program development, and capacity building, and with a focus on equity and public health, MOCEJ leads the City’s efforts to ensure that New York City is both reducing its emissions and preparing to adapt and protect New Yorkers from the intensifying impacts of climate change."
                url="https://climate.cityofnewyork.us/"
              />
              <AdvocacyGroupsCard
                title="Natural Resources Defense Council"
                content="MNRDC (the Natural Resources Defense Council) combines the power of more than 3 million members and online activists with the expertise of some 700 scientists, lawyers, and other environmental specialists to confront the climate crisis, protect the planet's wildlife and wild places, and to ensure the rights of all people to clean air, clean water, and healthy communities."
                url="https://www.nrdc.org/"
              />
              <AdvocacyGroupsCard
                title="Neighbors for a Greener Harlem"
                content="Neighbors for a Greener Harlem cultivates interdependence between the residents of Morningside Gardens and Grant Houses by supporting sustainable practices to improve our quality of life and foster a more inclusive neighborhood."
                url="https://www.greenerharlem.org/"
              />
              <AdvocacyGroupsCard
                title="New York City Environmental Justice Alliance"
                content="a citywide network of grassroots organizations from low-income neighborhoods and communities of color, fighting for environmental justice since 1991"
                url="https://www.southbronxunite.org/"
              />
              <AdvocacyGroupsCard
                title="South Bronx Unite"
                content="South Bronx Unite brings together neighborhood residents, community organizations, academic institutions, and allies to improve and protect the social, environmental, and economic future of Mott Haven and Port Morris."
                url="https://nyc-eja.org/"
              />
              <AdvocacyGroupsCard
                title="WeAct"
                content="Build healthy communities by ensuring that people of color and/or low income residents participate meaningfully in the creation of sound and fair environmental health and protection policies and practices"
                url="https://www.weact.org/"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ResourcesPage