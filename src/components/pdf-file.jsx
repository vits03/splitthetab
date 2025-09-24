import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Font,
  Image,
} from "@react-pdf/renderer";

import font from "./Inter-Regular.ttf";
import BoldInter from "./Inter-SemiBold.ttf";
import userIcons from "./user.png";

Font.register({
  family: "Inter",
  fonts: [
    { src: font, fontWeight: 400 }, // Regular
    { src: BoldInter, fontWeight: 700 }, // Bold
  ],
});

const MyDocument = ({ formData = {}, buyers = [] }) => {
  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  const calculateTotalSpendings = () => {
    const sum = buyers.reduce((total, buyer) => {
      return (
        total +
        buyer.descriptions.reduce((total, description) => {
          return total + description.amount;
        }, 0)
      );
    }, 0);
    return sum;
  };

  // --- NEW FUNCTION: Calculate Net Balances ---
  const calculateNetBalances = (buyers, personsList) => {
    const balances = {};

    // Initialize balances
    personsList.forEach((p) => {
      balances[p] = {};
      personsList.forEach((q) => {
        if (p !== q) balances[p][q] = 0;
      });
    });

    // Fill balances from buyers data
    buyers.forEach((buyer) => {
      buyer.descriptions.forEach((desc) => {
        const share = desc.amount / desc.contributors.length;

        desc.contributors.forEach((contributor) => {
          if (contributor !== buyer.name) {
            // contributor owes buyer
            balances[contributor][buyer.name] += share;
          }
        });
      });
    });

    // Net out balances
    const results = [];
    personsList.forEach((p) => {
      personsList.forEach((q) => {
        if (p !== q) {
          const net = balances[p][q] - balances[q][p];
          if (net > 0) {
            results.push({
              from: p,
              to: q,
              amount: net,
            });
          }
        }
      });
    });

    return results;
  };

  const OwedSection = ({ buyers, person }) => {
    const calculatedMembers = [];

    buyers.forEach((buyer) => {
      buyer.descriptions.forEach((descriptionObj) => {
        if (descriptionObj.contributors.includes(person)) {
          const exists = calculatedMembers.findIndex(
            (buyerName) => buyerName.name === buyer.name
          );
          const owed = descriptionObj.amount / descriptionObj.contributors.length;

          if (exists !== -1) {
            calculatedMembers[exists].moneyOwed += owed;
          } else {
            calculatedMembers.push({
              name: buyer.name,
              moneyOwed: owed,
            });
          }
        }
      });
    });

    return (
      <View style={{ border: "2px solid black", borderRadius: 20, padding: 15 }}>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "start",
            fontSize: 16,
            fontWeight: "bold",
            marginBottom: 8,
            gap: 5,
          }}
        >
          <Image
            src={userIcons}
            style={{
              width: 22,
              height: 22,
              color: "black",
              fontWeight: "bold",
            }}
          />
          <Text style={{ color: "#E34234" }}>
            {capitalizeFirstLetter(person)}
          </Text>
        </View>
        <View>
          <Text>owes:</Text>
          {calculatedMembers.length > 0 ? (
            calculatedMembers.map((member, index) => (
              <View
                key={index}
                style={{
                  display: "flex",
                  flexDirection: "row",
                  marginLeft: 30,
                  marginBottom: 5,
                  fontSize: 12,
                }}
              >
                <Text style={{ fontWeight: "bold" }}>
                  {member.moneyOwed.toFixed(2)}{" "}
                </Text>
                <Text>to </Text>
                <Text style={{ fontWeight: "bold" }}>
                  {capitalizeFirstLetter(member.name)}
                </Text>
              </View>
            ))
          ) : (
            <Text style={{ marginLeft: 30, fontSize: 12 }}>
              Nothing to anyone
            </Text>
          )}
        </View>
      </View>
    );
  };

  const ExpenseTable = ({ Buyers }) =>
    Buyers.map((buyer, index) => (
      <View key={index} style={{ flexBasis: "70%" }}>
        <Text
          style={{
            fontSize: 18,
            marginVertical: "10 5",
            textAlign: "left",
            fontWeight: "semibold",
            color: "#E34234",
          }}
        >
          {capitalizeFirstLetter(buyer.name)}
        </Text>
        <View
          style={{
            display: "flex",
            flexDirection: "col",
            border: "2px solid black",
            borderRadius: 10,
          }}
        >
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              borderBottom: "2px solid black",
            }}
          >
            <Text
              style={{
                flexBasis: "30%",
                borderRight: "2px solid black",
                marginHorizontal: 4,
                paddingVertical: 3,
                fontWeight: "bold",
              }}
            >
              Item
            </Text>
            <Text
              style={{
                flexBasis: "40%",
                borderRight: "2px solid black",
                marginHorizontal: 4,
                paddingVertical: 3,
                fontWeight: "bold",
              }}
            >
              People
            </Text>
            <Text
              style={{
                marginHorizontal: 4,
                paddingVertical: 3,
                fontWeight: "bold",
              }}
            >
              Price (Rs)
            </Text>
          </View>
          {buyer.descriptions.map((descriptionObj, index) => (
            <View
              key={index}
              style={
                index === buyer.descriptions.length - 1
                  ? styles.tableBottomLast
                  : styles.tableBottom
              }
            >
              <Text
                style={{
                  flexBasis: "30%",
                  borderRight: "2px solid black",
                  marginHorizontal: 4,
                  paddingVertical: 3,
                }}
              >
                {descriptionObj.spendingDescription}
              </Text>
              <View
                style={{
                  flexBasis: "40%",
                  borderRight: "2px solid black",
                  marginHorizontal: 4,
                  paddingVertical: 3,
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-evenly",
                  flexWrap: "wrap",
                }}
              >
                {descriptionObj.contributors.map((contributor, index) => (
                  <Text
                    style={{
                      display: "inline-block",
                      fontWeight: "bold",
                      marginBottom: 2,
                    }}
                    key={index}
                  >
                    {contributor},
                  </Text>
                ))}
              </View>
              <Text style={{ marginHorizontal: 4, paddingVertical: 3 }}>
                {descriptionObj.amount}
              </Text>
            </View>
          ))}
        </View>

        <View style={{ display: "flex", flexDirection: "row", marginTop: 4 }}>
          <Text
            style={{
              flexBasis: "55%",
              marginHorizontal: 4,
              fontWeight: "bold",
            }}
          ></Text>
          <Text
            style={{
              flexBasis: "15%",
              marginHorizontal: 4,
              fontWeight: "bold",
              fontSize: 15,
            }}
          >
            Total
          </Text>
          <Text
            style={{
              marginHorizontal: 4,
              fontWeight: "bold",
              fontSize: 15,
              color: "#E34234",
            }}
          >
            Rs{" "}
            {buyer.descriptions.reduce(
              (acc, currentValue) => acc + parseInt(currentValue.amount),
              0
            )}
          </Text>
        </View>
      </View>
    ));

  const styles = StyleSheet.create({
    tableBottom: {
      display: "flex",
      flexDirection: "row",
      borderBottom: "2px solid black",
    },
    tableBottomLast: {
      display: "flex",
      flexDirection: "row",
      borderBottom: 0,
    },
    header: {
      fontSize: 30,
      marginTop: 5,
      fontFamily: "Inter",
      color: "white",
      fontWeight: "heavy",
    },
    team: {
      display: "flex",
      flexDirection: "row",
      width: "80%",
      flexWrap: "wrap",
      justifyContent: "center",
      gap: 15,
    },
    teamSection: {
      display: "flex",
      flexDirection: "col",
      justifyContent: "center",
      alignItems: "center",
    },
    teamMember: {
      border: "2px solid black",
      borderRadius: 20,
      display: "flex",
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      padding: 10,
      gap: 5,
    },
    date: {
      fontSize: 13,
      fontFamily: "Inter",
      color: "white",
      marginTop: 7,
      marginBottom: 7,
    },
    page: {
      fontFamily: "Inter",
      flexDirection: "col",
      fontSize: 11,
      textShadow: "0 0 2px #000000",
    },
    section: {
      backgroundColor: "#E34234",
      paddingTop: 10,
      paddingHorizontal: 10,
    },
  });

  const TeamMembers = ({ Members }) => {
    if (!Members || Members.length === 0) {
      return <Text>No team members found.</Text>;
    }

    return (
      <View style={styles.team}>
        {Members.map((teamMember, index) => (
          <View key={index} style={styles.teamMember}>
            <Image
              src={userIcons}
              style={{
                width: 22,
                height: 22,
                borderRadius: 35,
                backgroundColor: "#E97451",
              }}
            />
            <Text>{capitalizeFirstLetter(teamMember)}</Text>
          </View>
        ))}
      </View>
    );
  };

  if (!formData || !buyers) return <div>Loading form data...</div>;

  return (
    <Document>
      <Page size="A4" style={styles.page} wrap={false}>
        <View style={styles.section}>
          <Text style={styles.header}>
            {capitalizeFirstLetter(formData.partyName) || "partyname"}
          </Text>
          <Text style={styles.date}>{formData.date}</Text>
        </View>

        <View style={styles.teamSection}>
          <Text
            style={{
              fontSize: 25,
              marginVertical: 35,
              fontWeight: "bold",
              color: "#E34234",
            }}
          >
            Lekip
          </Text>
          <TeamMembers Members={formData.personsList} />
        </View>

        <Text
          style={{
            fontSize: 25,
            fontWeight: "bold",
            marginTop: 35,
            marginHorizontal: "auto",
            color: "#E34234",
          }}
        >
          Expenses
        </Text>

        <View
          style={{
            display: "flex",
            flexDirection: "row",
            gap: 10,
            justifyContent: "space-evenly",
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <ExpenseTable Buyers={buyers} />
        </View>

        <View
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-evenly",
            alignItems: "center",
          }}
        >
          <View style={{ flexBasis: "70%", marginTop: 25 }}>
            <Text style={{ fontWeight: "bold", fontSize: 20 }}>
              Total Expense: Rs{" "}
              <Text style={{ color: "#E34234" }}>
                {calculateTotalSpendings() || 0}
              </Text>
            </Text>
          </View>
        </View>

        <Text
          style={{
            fontSize: 25,
            fontWeight: "bold",
            marginTop: 40,
            marginHorizontal: "auto",
            color: "#E34234",
          }}
        >
          Combien to dois to kam?
        </Text>

        <View
          style={{
            display: "flex",
            flexDirection: "row",
            flexWrap: "wrap",
            gap: 35,
            paddingVertical: 35,
            justifyContent: "space-evenly",
            alignItems: "center",
          }}
        >
          {formData.personsList.map((person) => {
            return <OwedSection person={person || ""} buyers={buyers || []} />;
          })}
        </View>

        {/* --- NEW SECTION: Net Spendings --- */}
        <Text
          style={{
            fontSize: 25,
            fontWeight: "bold",
            marginTop: 40,
            marginHorizontal: "auto",
            color: "#E34234",
          }}
        >
          Net Spendings
        </Text>

     <View
  style={{
    display: "flex",
    flexDirection: "column",
    paddingVertical: 20,
    gap: 8,
    justifyContent: "center",
    alignItems: "center",
  }}
>
  {calculateNetBalances(buyers, formData.personsList).length > 0 ? (
    calculateNetBalances(buyers, formData.personsList).map((res, i, arr) => (
      <View key={i} style={{ width: "100%", alignItems: "center" }}>
        <Text style={{ fontSize: 14 }}>
          <Text style={{ fontWeight: "bold" }}>
            {capitalizeFirstLetter(res.from)}
          </Text>{" "}
          owes{" "}
          <Text style={{ fontWeight: "bold" }}>
            {capitalizeFirstLetter(res.to)}
          </Text>{" "}
          Rs {res.amount.toFixed(2)}
        </Text>

        {/* Separator line after each person except the last */}
        {i !== arr.length - 1 && (
          <View
            style={{
              borderBottomWidth: 1,
              borderBottomColor: "black",
              marginVertical: 6,
              width: "80%", // adjust length of line
            }}
          />
        )}
      </View>
    ))
  ) : (
    <Text>Everyone is settled ✅</Text>
  )}
</View>

      </Page>
    </Document>
  );
};

export default MyDocument;
