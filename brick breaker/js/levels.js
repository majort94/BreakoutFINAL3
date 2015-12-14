"use strict";

 /**** So You Wanna Make a Level?        ********
 	Design Rules:
 		- Final array must be like "levelXAll"
 			where 'X' is the level number
 		- Follow the brick key to place bricks length 2
 			e.i. placing a normal brick would be adding
 				a '1' into the array with a '0' directly after
 				"...1,0,..."
	key:

		0 : nothing
		1 : normal brick
		...
		2 : ice trigger
				surrounding bricks become frozen bricks
		3 : fire trigger
				surrounding bricks become burning bricks
		...
		4 : stone brick
				takes multiple hits to break
		5 : frozen brick
				this brick takes an extra hit to destroy and slows the ball on contact
		6 : burning brick
				this brick becomes invincible while burning for 0.5 seconds and speeds up the ball on contact
		...
		7 : double ball brick
				spawns an extra ball in the field for a short duration
		...
		9 : poison trigger
				surrounding bricks become poisoned bricks
		10: poisoned brick
				burns twice as fast as fire bricks, disintegrates ball on contact

 	Features:
 		- Supports any number of Rows and Columns
 		- Each row does not have to be the same length but the longest one must be the
 			first row


 		*/

 	var level1_1 = [0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
	var level1_2 = [0,0,1,0,0,0,0,1,0,0,1,0,0,1,0,1,0,0,0,0];
	var level1_3 = [0,0,1,0,0,0,0,0,1,0,1,0,0,1,0,1,0,0,0,0];
	var level1_4 = [0,0,1,0,0,0,0,0,1,0,1,0,0,0,1,0,0,0,0,0];
	var level1_5 = [0,0,1,0,1,0,1,0,1,0,0,1,0,1,0,1,0,0,0,0];
	var level1_6 = [0,0,1,0,1,0,1,0,1,0,0,1,0,1,0,1,0,0,0,0];
	var level1_7 = [0,0,1,0,1,0,1,0,1,0,1,0,0,0,0,0,1,0,0,0];
	var level1_8 = [0,0,1,0,1,0,1,0,3,0,0,0,0,0,0,1,0,0,0,0];
	var level1_9 = [0,0,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0];
	var level1All = [level1_1, level1_2, level1_3, level1_4, level1_5, level1_6, level1_7, level1_8, level1_9];



	var level2_0 = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
	var level2_1 = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
	var level2_2 = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
	var level2_3 = [0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0];
	var level2_4 = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
	var level2_5 = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
	var level2_6 = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
	var level2_7 = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
	var level2_8 = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
	var level2All = [level2_0, level2_1, level2_2, level2_3, level2_4, level2_5, level2_6, level2_7, level2_8];


 	var level3_1 = [0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
	var level3_2 = [0,0,1,0,0,0,0,1,0,0,1,0,0,1,0,1,0,0,0,0];
	var level3_3 = [0,0,1,0,0,0,0,0,1,0,1,0,0,1,0,1,0,0,0,0];
	var level3_4 = [0,0,1,0,0,0,0,0,1,0,1,0,0,0,1,0,0,0,0,0];
	var level3_5 = [0,0,1,0,1,0,1,0,1,0,0,1,0,1,0,1,0,0,0,0];
	var level3_6 = [0,0,1,0,1,0,1,0,1,0,0,1,0,1,0,1,0,0,0,0];
	var level3_7 = [0,0,1,0,1,0,1,0,1,0,1,0,0,0,0,0,1,0,0,0];
	var level3_8 = [0,0,1,0,1,0,1,0,3,0,0,0,0,0,0,1,0,0,0,0];
	var level3_9 = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
	var level3All = [level3_1, level3_2, level3_3, level3_4, level3_5, level3_6, level3_7, level3_8, level3_9];







