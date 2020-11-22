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
        <main class="country-details">
            <div class="navigation-container">
                <button class="btn" v-on:click="$router.push({name: 'countries'})">Back</button>
            </div>
            <article class="country">
                <img class="country__flag" :src="country.flag" :alt="`Country Flag of {country.name}`" />
                <div class="country__wrapper">
                    <h3 class="country__name">{{country.name}}</h3>
                    <div class="country__details__wrapper">
                        <div class="details">
                            <dl class="details">
                                <div class="details__wrapper">
                                    <dt class="details__title">Native Name:</dt>
                                    <dd class="details__value">{{ country.nativeName }}</dd>
                                </div>
                                <div class="details__wrapper">
                                    <dt class="details__title">Population:</dt>
                                    <dd class="details__value">{{ country.population | number }}</dd>
                                </div>
                                <div class="details__wrapper">
                                    <dt class="details__title">Region:</dt>
                                    <dd class="details__value">{{ country.region }}</dd>
                                </div>
                                <div class="details__wrapper">
                                    <dt class="details__title">Sub Region:</dt>
                                    <dd class="details__value">{{ country.subregion }}</dd>
                                </div>
                                <div class="details__wrapper">
                                    <dt class="details__title">Capital:</dt>
                                    <dd class="details__value">{{ country.capital }}</dd>
                                </div>
                            </dl>
                        </div>
                        <div class="details">
                            <div class="details__wrapper">
                                <dt class="details__title">Top Level Domain:</dt>
                                <dd class="details__value">{{ country.topLevelDomain.join(', ') }}</dd>
                            </div>
                            <div class="details__wrapper">
                                <dt class="details__title">Currencies:</dt>
                                <dd class="details__value">{{ country.currencies.map(country => country.name).join(', ') }}</dd>
                            </div>
                            <div class="details__wrapper">
                                <dt class="details__title">Languages:</dt>
                                <dd class="details__value">{{ country.languages.map(language => language.name).join(', ') }}</dd>
                            </div>
                        </div>
                    </div>
                    <div class="country__borders">
                        <h4 class="borders_title">Border Countries:</h4>
                        <ul class="border-list">
                            <li class="border" v-for="border in borders" :key="border.alpha2code">
                                <router-link
                                    tag="button"
                                    class="btn"
                                    :to="{name: 'country', params: { id: border.alpha3Code }}"
                                >{{ border.name }}</router-link>
                            </li>
                        </ul>
                    </div>
                </div>
            </article>
        </main>
    </div>
</template>

<script>
export default {
    name: "Country",
    data() {
        return {
            country: null,
            borders: [],
        };
    },
    watch: {
        "$route.params.id": function (id) {
            this.getCountryContent(id);
        },
    },
    filters: {
        number(value) {
            if (!value) {
                return;
            }
            return new Intl.NumberFormat().format(value);
        }
    },
    async created() {
        await this.getCountryContent(this.$route.params.id);
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
        async getCountryContent(id) {
            this.borders = [];
            let data = await window.fetch(
                `https://restcountries.eu/rest/v2/alpha/${id}`
            );
            this.country = await data.json();

            this.country.borders.forEach(async (border) => {
                let data = await window.fetch(
                    `https://restcountries.eu/rest/v2/alpha/${border}`
                );
                let country = await data.json();
                this.borders.push(country);
            });
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

.btn {
    cursor: pointer;
    font-family: "Nunito Sans", sans-serif;
    font-weight: 600;
    border-radius: 2px;
    padding: 0.25rem 1.5rem;
    -webkit-box-shadow: -1px 0px 12px 1px rgba(0, 0, 0, 0.11);
    -moz-box-shadow: -1px 0px 12px 1px rgba(0, 0, 0, 0.11);
    box-shadow: -1px 0px 12px 1px rgba(0, 0, 0, 0.11);
    border: none;
    color: var(--text-color);
    background-color: var(--background-component);
}
.country-details {
    display: grid;
    padding: 0 1.5rem;
    gap: 3rem;
}

.country {
    display: grid;
    gap: 28px;
}

.country__details__wrapper {
    display: grid;
    gap: 28px;
    margin-bottom: 20px;
}

.country__flag {
    width: 100%;
}

.country__name {
    margin-bottom: 20px;
}

.details {
    display: grid;
    gap: 12px;
}

.details__wrapper {
    display: inline-flex;
    gap: 4px;
}

.details__title {
    font-weight: 600;
}

.borders_title {
    margin-bottom: 20px;
}

.border-list {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
}

@media screen and (min-width: 1024px) {
    .container {
        gap: 3rem;
    }

    .header {
        padding: 2rem 3rem;
    }

    .country-details {
        padding: 0 3rem;
    }

    .country {
        grid-template-columns: 1fr 1fr;
    }

    .country__details__wrapper {
        grid-template-columns: 1fr 1fr;
    }
}
</style>