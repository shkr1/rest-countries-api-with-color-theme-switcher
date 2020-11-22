<template>
    <div class="container">
        <header class="header">
            <nav class="header__nav">
                <h1 class="header__title">Where in the world?</h1>
                <button v-on:click="toggleMode" class="header__switch">
                    <svg
                        class="header__icon"
                        xmlns="http://www.w3.org/2000/svg"
                        width="512"
                        height="512"
                        viewBox="0 0 512 512"
                    >
                        <title>ionicons-v5-j</title>
                        <path
                            d="M160,136c0-30.62,4.51-61.61,16-88C99.57,81.27,48,159.32,48,248c0,119.29,96.71,216,216,216,88.68,0,166.73-51.57,200-128-26.39,11.49-57.38,16-88,16C256.71,352,160,255.29,160,136Z"
                            style="fill:none;stroke:#000;stroke-linecap:round;stroke-linejoin:round;stroke-width:32px"
                        />
                    </svg>
                    Dark Mode
                </button>
            </nav>
        </header>
        <div class="filters">
            <div class="filters__wrapper">
                <svg
                    class="wrapper__image"
                    xmlns="http://www.w3.org/2000/svg"
                    width="512"
                    height="512"
                    viewBox="0 0 512 512"
                >
                    <title>ionicons-v5-f</title>
                    <path
                        d="M221.09,64A157.09,157.09,0,1,0,378.18,221.09,157.1,157.1,0,0,0,221.09,64Z"
                        style="fill:none;stroke:#000;stroke-miterlimit:10;stroke-width:32px"
                    />
                    <line
                        x1="338.29"
                        y1="338.29"
                        x2="448"
                        y2="448"
                        style="fill:none;stroke:#000;stroke-linecap:round;stroke-miterlimit:10;stroke-width:32px"
                    />
                </svg>
                <input
                    v-on:input="search"
                    type="text"
                    placeholder="Search for a country..."
                    name="search"
                    id="search"
                    class="filters__search"
                />
            </div>
            <div ref="regions" v-on:click="toggleRegions" class="filters__regions">
                <p class="filters__regions__title">Filter by Region</p>
                <svg class="filters__arrow" xmlns='http://www.w3.org/2000/svg' width='512' height='512' viewBox='0 0 512 512'><title>ionicons-v5-a</title><polyline points='112 184 256 328 400 184' style='fill:none;stroke:#000;stroke-linecap:round;stroke-linejoin:round;stroke-width:48px'/></svg>
                <ul class="regions">
                    <li v-on:click="filterByRegion('africa')" class="region">Africa</li>
                    <li v-on:click="filterByRegion('americas')" class="region">America</li>
                    <li v-on:click="filterByRegion('asia')" class="region">Asia</li>
                    <li v-on:click="filterByRegion('europe')" class="region">Europe</li>
                    <li v-on:click="filterByRegion('oceania')" class="region">Oceania</li>
                </ul>
            </div>
        </div>
        <main class="countries">
            <article
                v-on:click="$router.push({ name: 'country', params: { id: country.alpha3Code }})"
                v-show="countries.length > 0"
                v-for="country in countries"
                :key="country.alpha2Code"
                class="country"
            >
                <img
                    :src="country.flag"
                    :alt="`Country flag of ${country.name}`"
                    class="country__flag"
                />
                <div class="country__properties">
                    <h3 class="country__name">{{ country.name }}</h3>
                    <dl class="country__information">
                        <div class="country__property">
                            <dt class="property__title">Population:</dt>
                            <dd class="property__data">{{ country.population }}</dd>
                        </div>
                        <div class="country__property">
                            <dt class="property__title">Region:</dt>
                            <dd class="property__data">{{ country.region }}</dd>
                        </div>
                        <div class="country__property">
                            <dt class="property__title">Capital:</dt>
                            <dd class="property__data">{{ country.capital }}</dd>
                        </div>
                    </dl>
                </div>
            </article>
            <section v-show="countries.length === 0" class="empty-data">There's no elements to show</section>
        </main>
    </div>
</template>

<script>
export default {
    name: "Countries",
    data() {
        return {
            countries: [],
            timeout: null,
        };
    },
    async mounted() {
        let data = await window.fetch("https://restcountries.eu/rest/v2/all");
        this.countries = await data.json();
    },
    methods: {
        toggleMode() {
            const html = document.querySelector("html");

            if (html.dataset.colorMode === "light") {
                html.dataset.colorMode = "dark";
                return;
            }

            html.dataset.colorMode = "light";
        },
        toggleRegions(el) {
            const regions = document.querySelector(".filters__regions");
            regions.classList.toggle("open");
        },
        async filterByRegion(region) {
            let data = await window.fetch(
                `https://restcountries.eu/rest/v2/region/${region}`
            );
            this.countries = await data.json();
            this.$refs.regions.classList.remove("open");
        },
        search: function (e) {
            if (this.timeout) {
                clearTimeout(this.timeout);
            }
            this.timeout = setTimeout(() => {
                this.searchByName(e.target.value);
            }, 300);
        },
        async searchByName(searchTerm) {
            if (!searchTerm) {
                return;
            }

            try {
                let data = await window.fetch(
                    `https://restcountries.eu/rest/v2/name/${searchTerm}`
                );
                if (!data.ok) {
                    this.countries = [];
                    return;
                }
                this.countries = await data.json();
            } catch (err) {
                console.error(err);
                this.countries = [];
            }
        },
    },
};
</script>

<style scoped>
.container {
    display: grid;
    gap: 1.5rem;
    padding-bottom: 2rem;
}

.header {
    padding: 2rem 1rem;
    background-color: var(--background-component);
    -webkit-box-shadow: 0px -1px 12px 1px rgba(0, 0, 0, 0.17);
    -moz-box-shadow: 0px -1px 12px 1px rgba(0, 0, 0, 0.17);
    box-shadow: 0px -1px 12px 1px rgba(0, 0, 0, 0.17);
}

.header__nav {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.header__title {
    font-size: 16px;
}

.header__switch {
    display: flex;
    align-items: flex-end;
    font-family: "Nunito Sans", sans-serif;
    font-weight: 600;
    cursor: pointer;
    border: none;
    background: none;
    color: var(--text-color);
}

.header__icon {
    margin-right: 8px;
    height: 20px;
    width: 20px;
}

.filters {
    padding: 0 1rem;
}

.filters__wrapper {
    display: flex;
    align-items: flex-end;
    padding: 1rem 2rem;
    border: none;
    border-radius: 6px;
    background-color: var(--background-component);
    -webkit-box-shadow: -1px 0px 12px 1px rgba(0, 0, 0, 0.11);
    -moz-box-shadow: -1px 0px 12px 1px rgba(0, 0, 0, 0.11);
    box-shadow: -1px 0px 12px 1px rgba(0, 0, 0, 0.11);
    margin-bottom: 1rem;
}

.wrapper__image {
    height: 20px;
    width: 20px;
    margin-right: 10px;
}

.wrapper__image > path {
    stroke: var(--input-placeholder) !important;
}

.wrapper__image > line {
    stroke: var(--input-placeholder) !important;
}

.filters__search {
    border: none;
    width: 100%;
    color: var(--input-placeholder);
    background-color: var(--background-component);
}

.filters__search::placeholder {
    font-family: "Nunito Sans", sans-serif;
    font-weight: 600;
    color: var(--input-placeholder);
    opacity: 1;
}

.filters__regions {
    display: flex;
    justify-content: space-between;
    position: relative;
    width: var(--regions-filter-width);
    padding: 1.25rem 1.5rem;
    border-radius: 6px;
    background-color: var(--background-component);
    cursor: pointer;
    -webkit-box-shadow: -1px 0px 12px 1px rgba(0, 0, 0, 0.11);
    -moz-box-shadow: -1px 0px 12px 1px rgba(0, 0, 0, 0.11);
    box-shadow: -1px 0px 12px 1px rgba(0, 0, 0, 0.11);
}

.filters__regions.open > .regions {
    display: grid;
}

.filters__regions__title {
    font-size: 15px;
    font-family: "Nunito Sans", sans-serif;
    font-weight: 600;
}

.filters__arrow {
    width: 20px;
}

.regions {
    display: none;
    gap: 1rem;
    position: absolute;
    padding: 1rem;
    width: var(--regions-filter-width);
    border-radius: 6px;
    background-color: var(--background-component);
    -webkit-box-shadow: -1px 0px 12px 1px rgba(0, 0, 0, 0.11);
    -moz-box-shadow: -1px 0px 12px 1px rgba(0, 0, 0, 0.11);
    box-shadow: -1px 0px 12px 1px rgba(0, 0, 0, 0.11);
    cursor: pointer;
    left: 0;
    top: calc(60px + 5px);
}

.region {
    font-size: 15px;
    color: var(--text-color);
    font-weight: 600;
}

.countries {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    padding: 0 1rem;
    gap: 2rem;
}

.country {
    display: flex;
    flex-direction: column;
    -webkit-box-shadow: -1px 0px 12px 1px rgba(0, 0, 0, 0.11);
    -moz-box-shadow: -1px 0px 12px 1px rgba(0, 0, 0, 0.11);
    box-shadow: -1px 0px 12px 1px rgba(0, 0, 0, 0.11);
    cursor: pointer;
}

.country__flag {
    width: 100%;
    object-fit: cover;
    border-radius: 6px 6px 0 0;
}

.country__properties {
    height: 100%;
    padding: 2rem 1.5rem;
    background-color: var(--background-component);
    border-radius: 0 0 6px 6px;
}

.country__name {
    font-size: 16px;
    margin-bottom: 1rem;
}

.country__property {
    display: flex;
    margin-bottom: 0.5rem;
}

.property__title {
    font-weight: 600;
}

.property__data {
    font-weight: 300;
    margin-left: 6px;
}

@media screen and (min-width: 1024px) {
    .header {
        padding: 2rem 3rem;
    }

    .filters {
        padding: 0 3rem;
    }

    .countries {
        padding: 0 3rem;
    }
}
</style>