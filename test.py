from typing import List


class Solution:
    def searchRange(self, nums: List[int], target: int) -> List[int]:
        low = 0
        high = len(nums)-1
        while low < high:
            # midle = (high + low) //2
            # if nums[midle] == target:
            #     start = midle
            #     end = midle
            #     while nums[start] == target:
            #         start = start - 1
            #         if start < 0:
            #             break
            #     while nums[end] == target:
            #         end = end + 1
            #         if end > len(nums)-1:
            #             break
            #     return [start + 1, end -1]
            # if nums[midle] < target:
            #     low = midle + 1
            # if nums[midle] > target:
            #     high = midle - 1
            midle = (high + low) //2
            if nums[midle] < target:
                low = midle + 1
            else:
                high = midle
            
        return [low, high]
    def isValidSudoku(self, board: List[List[str]]) -> bool:
        box3x3 = [[[] for _ in range(3)] for _ in range(3)]  
        for i in range(9):
            row = []
            col = []
            for j in range(9):
                # print(i//3)
                if board[i][j] in row:
                    return False
                if board[j][i] in col:
                    return False
                if board[i][j] in box3x3[i//3][j//3]:
                    return False
                if board[i][j] != ".":
                    row.append(board[i][j])
                if board[j][i] != ".":
                    col.append(board[j][i])
                if board[i][j] != ".":
                    box3x3[i//3][j//3].append(board[i][j])
        print(box3x3)
        return True
    def printMatrix(self, matrix: List[List[int]]) :
        for i in range(9):
            print("\n")
            for j in range(9):
                if matrix[i][j] == ".":
                    print(".", end=" ")
                else:
                    print(matrix[i][j], end=" ")
        print()      
    # def combinationSum(self, candidates: List[int], target: int) -> List[List[int]]:
            
    #     res = []

    #     def make_combination(idx, comb, total):
    #         if total == target:
    #             res.append(comb[:])
    #             return
            
    #         if total > target or idx >= len(candidates):
    #             return
            
    #         comb.append(candidates[idx])
    #         make_combination(idx, comb, total + candidates[idx])
    #         comb.pop()
    #         make_combination(idx+1, comb, total)

    #         return res

    #     return make_combination(0, [], 0)
    def combinationSum(self, candidates: List[int], target: int) -> List[List[int]]:
        result = []
       
        def combinations(candidates1: list[int], target: int, res):
            if(target == 0):
                    result.append(res[:])
                    return
            if(target < 0 ):
                    return
            for i in range(len(candidates1)):
                    res.append(candidates1[i])
                    combinations(candidates1[i:], target-candidates1[i], res)
                    res.pop()
                
        combinations(candidates, target, [])
        return result  
    def combinationsum2(self, candidates: List[int], target: int) -> List[List[int]]:
        result = []
        candidates.sort()
        def combinations(candidates1: List[int], target:int, res):
            if target == 0:
                   result.append(res[:])
                   return
            if target < 0:
                   return
            for i in range(len(candidates1)):
                   if i > 0 and candidates1[i] == candidates1[i-1]:
                        continue
                   res.append(candidates1[i])
                   combinations(candidates1[i+1:], target-candidates1[i], res)
                   res.pop()
        combinations(candidates, target, [])
        return result
    def canJump(self, nums: List[int]) -> bool:
        # result = False
        # lenOfArr = len(nums)
        # def canJump1(nums1: List[int], total) -> bool:
        #     if total == lenOfArr:
        #         result = True    
        #     for i in range(len(nums1)):
        #         if nums1[i] == 0:
        #             continue
        #         for j in range(nums1[i], 0, -1):
        #             canJump1(nums1[j:], total + j)
            
            
        # return(canJump1(nums, 1))
        # return(result)
        goal = len(nums) - 1

        for i in range(len(nums) - 2, -1, -1):
            if i + nums[i] >= goal:
                goal = i
        
        return True if goal == 0 else False
                   
            
        
solution = Solution()
print(solution.canJump([2,3,1,1,4]))
# for i in range(10, 1 , -1):
#     print(i)