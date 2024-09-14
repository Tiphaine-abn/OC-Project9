import { fireEvent, getAllByTestId, getByTestId, getByText, render, screen, waitFor } from "@testing-library/react";
import Home from "./index";
import { api, DataProvider } from "../../contexts/DataContext";
import { getMonth } from "../../helpers/Date";

describe("When Form is created", () => {
  it("a list of fields card is displayed", async () => {
    render(<Home />);
    await screen.findByText("Email");
    await screen.findByText("Nom");
    await screen.findByText("Prénom");
    await screen.findByText("Personel / Entreprise");
  });

  describe("and a click is triggered on the submit button", () => {
    it("the success message is displayed", async () => {
      render(<Home />);
      fireEvent(
        await screen.findByText("Envoyer"),
        new MouseEvent("click", {
          cancelable: true,
          bubbles: true,
        })
      );
      await screen.findByText("En cours");
      await screen.findByText("Message envoyé !");
    });
  });

});


describe("When a page is created", () => {
  it("a list of events is displayed", async () => {
    // Surcharger la fonction qui fait appel à l'API
    api.loadData = jest.fn().mockReturnValue(require('../../../public/events.json'));
    render(<DataProvider><Home /></DataProvider>);
    const eventSection = screen.getByTestId("events-section");
    // Attendre que le DataProvider aie récupéré les données
    await waitFor(() => {
      getAllByTestId(eventSection, "card-testid");
    });
    expect(eventSection).toBeInTheDocument();
    getAllByTestId(eventSection, "card-testid").forEach((elem) => {
      expect(elem).toBeInTheDocument();
    })
  })
  it("a list a people is displayed", () => {
    render(<Home />);
    const peopleSection = screen.getByTestId("people-section");
    expect(peopleSection).toBeInTheDocument();
    expect(screen.getByText("Jean-baptiste")).toBeInTheDocument;
  })
  it("a footer is displayed", () => {
    render(<Home />);
    expect(screen.getByTestId("footer")).toBeInTheDocument();
  })
  it("an event card, with the last event, is displayed in the footer", async () => {
    // Surcharger la fonction qui fait appel à l'API
    const data = require('../../../public/events.json');
    api.loadData = jest.fn().mockReturnValue(data);
    render(<DataProvider><Home /></DataProvider >);

    const sortedData = data.events.sort((a, b) => new Date(b.date) - new Date(a.date));
    const lastEvent = sortedData[0];
    //console.log(lastEvent);

    const footer = screen.getByTestId("footer");
    // Attendre que le DataProvider aie récupéré les données
    await waitFor(() => {
      getByTestId(footer, "card-testid");
    });
    // Vérifier que la carte de l'événement est bien présente
    const eventCard = getByTestId(footer, "card-testid");
    expect(eventCard).toBeInTheDocument();

    // Vérifier que l'image de la carte est bien présente
    const eventImage = getByTestId(footer, "card-image-testid");
    const imageSrc = eventImage.getAttribute("src");
    expect(imageSrc).toBeDefined();

    // Vérifier que le titre de l'événement correspond au titre du dernier événement
    expect(getByText(footer, lastEvent.title)).toBeInTheDocument();

    // Vérifier que le mois affiché correspond à celui du dernier événement
    const eventMonth = getByTestId(footer, "card-testid")
      .querySelector(".EventCard__month")
      .textContent;
    expect(eventMonth).toBe(getMonth(new Date(lastEvent.date)));
    // console.log(eventMonth);
  })
});
