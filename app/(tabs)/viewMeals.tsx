import { Image, StyleSheet, Platform, FlatList, Text, View } from 'react-native';
import React, { Component } from 'react';
import SQLite from 'react-native-sqlite-storage';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

// Configure SQLite
SQLite.DEBUG(true);
SQLite.enablePromise(false);

const database_name = "Meals.db";
const database_version = "1.0";
const database_displayname = "Meal Database";
const database_size = 200000;

let db: SQLite.SQLiteDatabase;

type SQLiteDemoState = {
  progress: string[];
};

class SQLiteDemo extends Component<{}, SQLiteDemoState> {
  progress: string[];

  constructor(props: {}) {
    super(props);
    this.progress = [];
    this.state = {
      progress: [],
    };
  }

  updateProgress = (text: string, resetState = false) => {
    const progress = resetState ? [text] : [...this.progress, text];
    this.progress = progress;
    this.setState({ progress });
  };

  componentWillUnmount() {
    this.closeDatabase();
  }

  errorCB = (err: { message: any }) => {
    console.log("error: ", err);
    this.updateProgress("Error: " + (err.message || err), true);
    return false;
  };

  successCB = () => {
    console.log("SQL executed ...");
  };

  openCB = () => {
    this.updateProgress("Database OPEN", false);
  };

  closeCB = () => {
    this.updateProgress("Database CLOSED", false);
  };

  deleteCB = () => {
    console.log("Database DELETED");
    this.updateProgress("Database DELETED", false);
  };

  populateDatabase = (db: SQLite.SQLiteDatabase) => {
    this.updateProgress("Database integrity check", false);
    db.executeSql('SELECT 1 FROM Version LIMIT 1', [], () => {
      this.updateProgress("Database is ready ... executing query ...", false);
      db.transaction(this.queryMeals, this.errorCB, () => {
        this.updateProgress("Processing completed", false);
      });
    }, (error) => {
      console.log("Received version error:", error);
      this.updateProgress("Database not yet ready ... populating data", false);
      db.transaction(this.populateDB, this.errorCB, () => {
        this.updateProgress("Database populated ... executing query ...", false);
        db.transaction(this.queryMeals, this.errorCB, () => {
          this.updateProgress("Processing completed", false);
          this.closeDatabase();
        });
      });
    });
  };

  populateDB = (tx: SQLite.Transaction) => {
    this.updateProgress("Executing DROP statements", false);

    tx.executeSql('DROP TABLE IF EXISTS Meals;');

    this.updateProgress("Executing CREATE statements");

    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS Meals (
        meal_id INTEGER PRIMARY KEY NOT NULL,
        name VARCHAR(55),
        calories INTEGER,
        carbs INTEGER,
      );`
      //TODO: ADD OTHER NUTRITIONAL INFO
    );

    this.updateProgress("Executing INSERT statements");

    // Insert sample data
    tx.executeSql(`INSERT INTO Meals (name, calories, carbs) VALUES ("Oatmeal", 40, 50')`);
    // ... other insert statements
  };

  queryMeals = (tx: SQLite.Transaction) => {
    console.log("Executing JSON1 queries...");

    tx.executeSql(
      `SELECT JSON_OBJECT('Name', m.name, 'Calories', m.calories, 'Carbohydrates', m.carbs) AS data FROM Meals m`,
      [],
      this.querySuccess,
      //this.errorCB
    );
  };

  querySuccess = (_: SQLite.Transaction, results: SQLite.ResultSet) => {
    this.updateProgress("Query completed");
    for (let i = 0; i < results.rows.length; i++) {
      const row = results.rows.item(i);
      this.updateProgress(row.data);
    }
  };

  loadAndQueryDB = () => {
    this.updateProgress("Opening database ...", true);
    db = SQLite.openDatabase({name: database_name}, this.openCB, this.errorCB);
    this.populateDatabase(db);
  };

  deleteDatabase = () => {
    this.updateProgress("Deleting database");
    SQLite.deleteDatabase({name: database_name}, this.deleteCB, this.errorCB);
  };

  closeDatabase = () => {
    if (db) {
      console.log("Closing database ...");
      this.updateProgress("Closing database");
      db.close(this.closeCB, this.errorCB);
    } else {
      this.updateProgress("Database was not OPENED");
    }
  };

  runDemo = () => {
    this.updateProgress("Starting SQLite Callback Demo", true);
    this.loadAndQueryDB();
  };

  renderProgressEntry = (entry: string) => (
    <View style={listStyles.li}>
      <Text style={listStyles.liText}>{entry}</Text>
    </View>
  );

  render() {
    return (
      <View style={styles.mainContainer}>
        <View style={styles.toolbar}>
          <Text style={styles.toolbarButton} onPress={this.runDemo}>Run Demo</Text>
          <Text style={styles.toolbarButton} onPress={this.closeDatabase}>Close DB</Text>
          <Text style={styles.toolbarButton} onPress={this.deleteDatabase}>Delete DB</Text>
        </View>
        <FlatList
          data={this.state.progress}
          renderItem={({ item }) => this.renderProgressEntry(item)}
          keyExtractor={(item, index) => index.toString()}
          style={listStyles.liContainer}
        />
      </View>
    );
  }
}

const listStyles = StyleSheet.create({
  li: { borderBottomColor: '#c8c7cc', borderBottomWidth: 0.5, paddingTop: 15, paddingBottom: 15 },
  liText: { color: '#333', fontSize: 17, fontWeight: '400' },
  liContainer: { backgroundColor: '#fff', flex: 1 },
});

const styles = StyleSheet.create({
  mainContainer: { flex: 1 },
  toolbar: { backgroundColor: '#51c04d', paddingTop: 30, paddingBottom: 10, flexDirection: 'row' },
  toolbarButton: { color: 'blue', textAlign: 'center', flex: 1 },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});

export default function ViewMealsScreen() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <Image
          source={require('@/assets/images/partial-react-logo.png')}
          style={styles.reactLogo}
        />
      }>
      <ThemedView style={styles.mainContainer}>
        <ThemedText type="title">Welcome!</ThemedText>
        <SQLiteDemo />
      </ThemedView>
    </ParallaxScrollView>
  );
}
