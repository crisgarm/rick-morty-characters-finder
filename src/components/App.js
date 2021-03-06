import React, { useEffect, useState } from "react";
import { Route, Switch } from "react-router-dom";
import "../stylesheets/App.scss";
import "../stylesheets/Form.scss";
import getDataFromApi from "../services/api";
import Header from "./Header";
import CharacterList from "./CharacterList";
import Filters from "./Filters";
import CharacterDetail from "./CharacterDetail";
import Loading from "./Loading";

const App = () => {
  // STATES
  const [characters, setCharacters] = useState([]);
  const [nameFilter, setNameFilter] = useState("");
  const [speciesFilter, setSpeciesFilter] = useState("all");
  const [orderFilter, setOrderFilter] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  //API
  useEffect(() => {
    setIsLoading(true);
    getDataFromApi().then((data) => {
      setCharacters(data);
      setIsLoading(false);
    });
  }, []);

  // HANDLE EVENTS
  const handleFilterChange = (data) => {
    if (data.id === "name") {
      setNameFilter(data.value);
    } else if (data.id === "species") {
      setSpeciesFilter(data.value);
    }
  };

  const handleCheckInput = (inputChecked) => {
    if (inputChecked) {
      setOrderFilter(true);
    } else {
      setOrderFilter(false);
    }
  };

  // FUNCTIONS

  // function to filter by name
  function filterByName(character) {
    return character.name.toLowerCase().includes(nameFilter.toLowerCase());
  }

  // function to filter by specie
  function filterBySpecie(character) {
    return speciesFilter === "all"
      ? true
      : character.species.toLowerCase() === speciesFilter;
  }

  // function to sort characters by alphabetical order
  function sortCharacters(prev, next) {
    if (prev.name > next.name) {
      return 1;
    }
    if (prev.name < next.name) {
      return -1;
    }
    return 0;
  }

  // RENDER
  const filteredCharacters = characters
    .filter(filterByName)
    .filter(filterBySpecie);

  let newCharacters;
  if (orderFilter) {
    newCharacters = filteredCharacters.sort(sortCharacters);
  } else {
    newCharacters = filteredCharacters;
  }

  const renderCharacterDetail = (props) => {
    const findCharacter = characters.find((character) => {
      return character.id === parseInt(props.match.params.id);
    });
    if (findCharacter !== undefined) {
      return <CharacterDetail character={findCharacter} />;
    }
  };

  return (
    <>
      {isLoading === true ? <Loading /> : null}
      <Header />
      <main>
        <Switch>
          <Route exact path="/">
            <Filters
              handleFilterChange={handleFilterChange}
              nameFilter={nameFilter}
              handleCheckInput={handleCheckInput}
            />
            <section>
              <CharacterList characters={newCharacters} />
            </section>
          </Route>
          <Route path="/character/:id" render={renderCharacterDetail} />
        </Switch>
      </main>
    </>
  );
};

export default App;
