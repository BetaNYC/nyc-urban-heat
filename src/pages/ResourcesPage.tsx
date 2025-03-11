import { useState } from "react";
import Nav from "../components/Nav";
import Banner from "../components/Banner";
import ResourceDefinitionCard from "../components/ResourceDefinitionCard";
import ResourceCard from "../components/ResourceCard";
import AdvocacyGroupsCard from "../components/AdvocacyGroupsCard";

const ResourcesPage = () => {
  const tags = [
    // "Understanding the NYC Urban Heat Data Portal",
    "NYC Extreme Heat Resources",
    "Directory of Urban Heat Advocacy Groups",
  ];

  const [clickedIndex, setClickedIndex] = useState<string>(tags[0]);

  return (
    <div className="w-full">
      <Nav />
      <Banner
        title="Resources"
        tags={tags}
        content="Learn more about how to stay safe with urban heat resources and connect with NYC community-based organizations that are advocating for climate resilience."
        clickedIndex={clickedIndex}
        setClickedIndex={setClickedIndex}
      />
      {/* {clickedIndex === "Understanding the NYC Urban Heat Data Portal" &&
        (<div className="flex justify-center">
          <div className="px-5 py-[5rem] container">
            <div className="mb-20">
              <h1 className="font-semibold text-headline">Terms and Definitions</h1>
              <p className="font-regular text-regular max-w-[36rem]">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Nisi, eligendi similique
                inventore eos animi molestiae ut sapiente, consectetur repellat, quis a. Tempore
                doloremque, asperiores accusamus natus eum corrupti reiciendis rerum.
              </p>
            </div>
            <div className="flex flex-col gap-[4.5rem]">
              <ResourceDefinitionCard title="Outdoor Heat Exposure Index" content="" />
              <ResourceDefinitionCard title="Mean Radiant Temperature (MRT)" content="Mean Radiant Temperature (MRT) is central to our understanding of the radiant heat exchange between the human body and the surrounding environment. MRT is a useful concept as the net exchange of radiant energy between two objects is approximately proportional to the product of their temperature difference multiplied by their emissivity (ability to emit and absorb heat). The MRT is simply the area-weighted mean temperature of all the objects surrounding the body. You can also use a dry black globe to measure MRT.
                    The MRT layer in this portal is produced using the Land Cover Layer of New York City (2017, resampled to one-meter resolution). The MRT layer is calculated for 2 PM on July 15th as a typical summer day. The MRT is produced using SOLWEIG model. The input values of the model are: 1) air temperature: 82.4; relative humidity: 50%; water temperture: 71.6; global radation: 600; direct radation 700; diffuse radation: 150; wind speed: 3.1 m/s; wind sensor height 3m; utc offset: -4; local standard time 14:00."/>
              <ResourceDefinitionCard title="Surface Temperature" content="Surface Temperature (ST) refers to the temperature of the ground or other surfaces, which can vary significantly from air temperature due to direct solar heating. 
Surface Temperature indicates how hot the “surface” of the Earth would feel to the touch in a particular location (i.e. building roofs, grass, tree canopy, etc.). Surface temperature is not the same as the air temperature in the daily weather report. 
We retrieved the surface temperature from the Landsat 8/9 Level 2 Collection dataset (https://www.usgs.gov/landsat-missions/landsat-collection-2-level-2-science-products). These layers are extracted from Band 10 of Landsat 8 and 9 images. The resolution of these raster layers is 30m. We have included all cloud-free images available for this region between 2013 and 2023."/>
              <ResourceDefinitionCard title="Tree Canopies" content="Urban tree canopy (UTC) shows areas where leaves, branches, and stems of trees cover the ground, when viewed from above. UTC reduces the urban heat island effect, reduces heating/cooling costs, lowers air temperatures, reduces air pollution. 
We have extracted the tree canopy layer from New York City's high-resolution land cover data (2017, 0.5 feet). The layer is resampled to a 1-meter resolution. The source of this layer is NYC Open Data. "/>
              <ResourceDefinitionCard title="Cool Roofs" content="Buildings with cool roofs absorb and transfer less heat from the sun to the building compared with a more conventional roof and have a have a reflectivity value greather than or equal to 60. Buildings with cool roofs use less air conditioning, save energy, and have more comfortable indoor temperatures. Cool roofs also impact surrounding areas by lowering temperatures outside of buildings and thus mitigating the heat island effect. We have measured the roof reflectivity from the ortho images of New York City (2020). For further information about this layer, see: https://arcg.is/1q5imC" />
              <ResourceDefinitionCard title="Permeable Surfaces" content="Permeable surfaces, also known as porous or pervious surfaces, are materials that allow water to pass through them, rather than impeding its flow. These surfaces are designed to reduce stormwater runoff, filter out pollutants, and recharge groundwater aquifers. 
This layer is extracted from New York City's high-resolution land cover layer (2017, 0.5 feet). We chose the land cover classes of bare soil, grass, and water as the permeable surfaces. We resampled this layer to 1 meter. The high-resolution land cover layer is available through NYC Open Data."/>
              <ResourceDefinitionCard title="Air Temperature" content="Air Temperature or Dry-Bulb Temperature (DBT) is the temperature of air measured by a thermometer freely exposed to the air, but shielded from radiation. The thermometer is typically placed at about 2 meters above the ground. This is independent of the humidity of the air. " />
              <ResourceDefinitionCard title="Air Heat Index" content="Heat Index is a measure of how hot it really feels when factoring in the relative humidity. This index is a combination of air temperature and relative humidity and you can calculate it using a formula." />
              <ResourceDefinitionCard title="Weather Station" content="The weather station data reports each day's air temperature, relative humidity, and heat index values. We included the maximum and minimum daily values. To show how these values differ from the historical normals, we provided both minimum and maximum air temperature averages. These values are calculated for 1991-2020 extracted from the New York City Central Park weather station (https://www.weather.gov/media/okx/Climate/CentralPark/monthlyannualtemp.pdf)"/>
            </div>
          </div>
        </div>)
      } */}
      {
        clickedIndex === "NYC Extreme Heat Resources" &&
        <div className="flex justify-center">
          <div className="px-5 py-[5rem] container">
            <div className="mb-20">
              <h1 className="font-semibold text-headline">Extreme Heat Resources</h1>
              <p className="font-regular text-regular max-w-[36rem]">
                Learn more about extreme heat risks and how to protect yourself when it's hot outside. Find New York City information on where to stay cool, how to assess your neighborhood's heat vulnerability, and other local support, as well as national level resources on heat health and heat island.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <ResourceCard title="NYC Beat the Heat!" logos={[true, false, false,false,false,false,false]} content="Heat is dangerous and kills hundreds of New Yorkers each year. Protect yourself, your loved ones, and your community with the right resources to keep cool during the summer. " cta="Go to Beat the Heat! website" url="https://www.nyc.gov/beattheheat"/>
              <ResourceCard title="NYC Cool Options" logos={[true, true, true,false,false,false,false]}  content="When the weather is hot, indoor spaces with air conditioning or outdoor parks with shade, sprinklers, or pools can help stay cool. The NYC Cool Options website provides resources to find a cooling center nearby." cta="Find a Cooling Center" url="https://finder.nyc.gov/coolingcenters/"/>
              <ResourceCard title="Cool It! NYC" logos={[false, false, true,false,false,false,false]}  content="Many NYC Parks spaces provide places across the city to hydrate, refresh, and stay in the shade during hot weather. The Cool It! NYC map shows locations of where to find water features, drinking fountains, and tree cover." cta="Go to Cool It! NYC map" url="https://www.nycgovparks.org/about/health-and-safety-guide/cool-it-nyc"/>
              <ResourceCard title="NYC Health Risks to Extreme Heat" logos={[false, true, false,false,false,false,false]} content="Hot and humid weather can put extra stress on the body, and this heat can worsen chronic health conditions, such as heart and lung disease. Be prepared and keep yourself and your family safe with this resource." cta="Learn about hot weather and your health" url="https://www.nyc.gov/site/doh/health/emergency-preparedness/emergencies-extreme-weather-heat.page"/>
              <ResourceCard title="NYC Heat Vulnerability Index" logos={[false, true, false,false,false,false,false]} content="Use the NYC Environment & Health Heat Vulnerability Explorer to look up your neighborhood's heat vulnerability and the neighborhood characteristics that affect it." cta="View the Heat Vulnerability Index" url="https://a816-dohbesp.nyc.gov/IndicatorPublic/data-features/hvi/"/>
              <ResourceCard title="EPA Heat Island Effect" logos={[false,false,false,true,false,false,false]} content="Heath islands occur when a developed area experiences higher temperatures within a city. The U.S. Environmental Protection Agency (EPA) provides information about heat islands, cooling strategies, and outreach materials to reduce the impact of heat islands on communities." cta="Learn more about heat island impacts" url="https://www.epa.gov/heatislands"/>
              <ResourceCard title="NIHHIS Heat.gov" logos={[false,false,false,false,true,false,false]} content="The National Integrated Heat Health Information System (NIHHIS) provides heat and health information to reduce the health, economic, and infrastructural impacts of extreme heat in the U.S." cta="View the Heat.gov web portal" url="http://heat.gov/"/>
              <ResourceCard title="CDC Heat Health" logos={[false,false,false,false,false,true,false]} content="Get information on Centers for Disease Control and Prevention (CDC) recommendations for how to protect yourself and others when it's hot outside. You can check your local heat risk and air quality with the U.S. on the HeatRIsk Dashbosrd." cta="View CDC heat health resources" url="https://www.cdc.gov/heat-health/about/index.html"/>
              <ResourceCard title="Extreme Heat and Aging Exchange" logos={[false,false,false,false,false,false,true]} content="The Extreme Heat and Aging Exchange is a forum for researchers, policymakers, and advocates to find and share resources dealing with extreme urban heat and its impacts on the health of older adults." cta="View the Extreme Heat and Aging Exchange forum" url="https://extremeheat.us/"/>
            </div>
          </div>
        </div>
      }
      {
        clickedIndex === "Directory of Urban Heat Advocacy Groups" &&
        <div className="flex justify-center">
          <div className="px-5 py-[5rem] container">
            <div className="mb-20">
              <h1 className="font-semibold text-headline">Directory of Urban Heat Advocacy Groups</h1>
              <p className="font-regular text-regular max-w-[36rem]">
              Learn more about organizations that are working to build a more heat-resilent New York City.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              <AdvocacyGroupsCard img="/icons/community_land_trust.png" cta="View the ENYCLT website" url="https://www.eastnewyorkclt.org/" title="East New York Community Land Trust" content="A grassroots, people of color-led non-profit organization aiming to protect, stabilize, and expand the stock of affordable homes, locally-owned small businesses, and green spaces in East New York and Brownsville" />
              <AdvocacyGroupsCard img="/icons/el_puente.png" title="El Puente" cta="View the El Puente website" url="https://www.elpuente.org/" content="El Puente combines art, youth development, and community building to drive social justice initiatives, empowering future leaders and advocating for equitable communities." />
              {/* <AdvocacyGroupsCard url="/icons/mayor.png" title="Mayor’s Office of Climate & Environmental Justice" content="MOCEJ works to create a sustainable NYC by making buildings efficient, infrastructure climate-ready, and energy clean, while transforming streets into vibrant public spaces." /> */}
              <AdvocacyGroupsCard img="/icons/natural.png" title="Natural Resources Defense Council" cta="View the NRDC website" url="https://www.nrdc.org/" content="NRDC ensures the rights of all people to clean air, clean water, and healthy communities." />
              <AdvocacyGroupsCard img="/icons/neighbor.png" title="Neighbors for a Greener Harlem" cta="Visit the Neighbors for a Greener Harlem website" url="https://www.greenerharlem.org/" content="Supporting sustainable practices to improve our quality of life and foster a more inclusive neighborhood." />
              <AdvocacyGroupsCard img="/icons/environmental.png" title="New York City Environmental Justice Alliance" cta="Visit the NYC-EJA website" url="https://nyc-eja.org/" content="a citywide network of grassroots organizations from low-income neighborhoods and communities of color, fighting for environmental justice since 1991" />
              <AdvocacyGroupsCard img="/icons/bronx.png" title="South Bronx Unite" cta="Visit the South Bronx Unite website" url="https://www.southbronxunite.org/" content="Improve and protect the social, environmental, and economic future of Mott Haven and Port Morris" />
              <AdvocacyGroupsCard img="/icons/we_act.png" title="WeAct" cta="Visit the WE ACT website" url="https://www.weact.org/" content="Build healthy communities by ensuring that people of color and/or low income residents participate meaningfully in the creation of sound and fair environmental health and protection policies and practicesＦ" />
            </div>
          </div>
        </div>
      }
    </div>
  );
};

export default ResourcesPage;
