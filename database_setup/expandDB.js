
const URI = 'Set your db URI here';
const NAME = 'Copy your database name'

db = Mongo(URI).getDB(NAME);

/*
{
	_id 						: IdOject,
	Ccode 						: String,
	continent 					: String may be null,
	location 					: String,
	population 					: long,
	population_density 			: float,
	median_age 					: float,
	aged_65_older 				: float,
	aged_70_older 				: float,
	gdp_per_capita 				: float,
	extreme_poverty 			: float,
	cardiovasc_death_rate 		: float,
	diabetes_prevalence 		: float,
	female_smokers 				: float,
	male_smokers 				: float,
	handwashing_facilities 		: float,
	hospital_beds_per_thousand 	: float,
	life_expectancy 			: float,
	human_development_index 	: float,
	data : [
		{
			date							: String,
			total_cases						: long,
			new_cases						: long,
			new_cases_smoothed				: float,
			total_deaths					: long,
			new_deaths						: long,
			new_deaths_smoothed				: float,
			total_cases_per_million			: float,
			new_cases_per_million			: float,
			new_cases_smoothed_per_million	: float,
			total_deaths_per_million		: float,
			new_deaths_per_million			: float,
			new_deaths_smoothed_per_million	: float
		}
	]
}
*/

db.Countries.aggregate([
	{
		$project:{
			_id:0,
			Ccode:1,
			location:1,
			population: 1,
			continent: 1,
			'data.date': 1,
			'data.total_cases': 1,
			'data.total_deaths': 1,
			'data.total_cases_per_million': 1,
			'data.total_deaths_per_million': 1
		}
	},
	{
		$addFields:{
			data: {
				$map: {
					input: [{$slice: ['$data', -30,1]}, {$slice: ['$data', -7,1]}, {$slice: ['$data', -1]}],
					as: 'day',
					in: {$first: '$$day'}
				}
			}
		}
	},
	{
		$out:{
			db: 'C19',
			coll: 'regions'
		}
	}
]);

db.Countries.aggregate([
	{
		$project: {
			_id:0,
			Ccode: 1,
			location: 1,
			continent: 1,
			population: 1,
			deaths: {
				$last: '$data.total_deaths'
			},
			total_cases: {
				$last: '$data.total_cases'
			},
			'data.date': 1,
			'data.new_cases': 1,
			'data.new_deaths': 1,
			'data.new_cases_per_million': 1,
			'data.new_deaths_per_million': 1
		}
	},
	{
		$addFields: {
			data: {
				$map: {
					input: '$data',
					as: 'day',
					in: {
						$mergeObjects: [
							'$$day',
							{
								date: {
									$toDate: '$$day.date'
								}
							}
						]
					}
				}
			}
		}
	},
	{
		$out: 'reduced_countries'
	}
]);